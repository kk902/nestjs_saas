import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { orderStatus, orderType } from './entities/order.entity';
import { RechargeOrderDto } from './dto/recharge-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { RedisService } from 'src/config/redis/redis.service';
import Big from 'big.js';
import { Order } from './schemas/order.schema';
import { DeductOrderDto } from './dto/deduct-order.dto';
import { FindAllOrderDto } from './dto/findAll-order.dto';
import { FindOneOrderDto } from './dto/findOne-order.dto';
@Injectable()
export class OrderService {
  private key = ''
  constructor(
    private readonly redisService: RedisService,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Order') private orderModel: Model<Order>,
    
  ){}
  async recharge({user_id, amount}: RechargeOrderDto) {
    this.key = `lock:user:${user_id}`
    await this.redisService.addLock(this.key)
    const order_type = orderType.RECHARGE
    const userData = await this.checkUserId(user_id)
    const balance = await this.changeBlance(userData, amount, order_type)
    const order = await this.buildOrder({userData, amount, balance, order_type})
    await this.redisService.unLock(this.key)
    return order
  }

  async deduct({user_id, amount}: DeductOrderDto) {
    this.key = `lock:user:${user_id}`
    await this.redisService.addLock(this.key)
    const order_type = orderType.DEDUCT
    const userData = await this.checkUserId(user_id)
    const balance = await this.changeBlance(userData, amount, order_type)
    const order = await this.buildOrder({userData, amount, balance, order_type})
    await this.redisService.unLock(this.key)
    return order
  }

  async findAll(findAllOrderDto: FindAllOrderDto) {
    const filter: FilterQuery<any> = {};
    if (findAllOrderDto.user_id) filter.user_id = findAllOrderDto.user_id
    if (findAllOrderDto.order_id) filter._id = findAllOrderDto.order_id
    // 检查并设置时间
    if (findAllOrderDto.start_time) {
      filter.createdAt = filter.createdAt || {}; // 确保 createdAt 存在
      filter.createdAt.$gte = findAllOrderDto.start_time;
    }
    if (findAllOrderDto.end_time) {
      filter.createdAt = filter.createdAt || {}; // 确保 createdAt 存在
      filter.createdAt.$lte = findAllOrderDto.end_time;
    }
    if (findAllOrderDto.saas_name) {
      filter.saas_name = {"$regex": findAllOrderDto.saas_name, "$options": "i"}
    }
    const {limit, page} = findAllOrderDto
    const page_index = page
    const page_size = limit
    const total = await this.orderModel.countDocuments(filter).exec();
    if(!total) {
      return {paginateData: [],total,page_index,totalPages: 0}
    }
    const skip = (page_index - 1) * page_size
    const totalPages = Math.ceil(total / page_size)
    if(skip >= total) throw new HttpException('超出页数限制', HttpStatus.FORBIDDEN);
    const paginateData = await this.orderModel.find(filter).skip(skip).limit(page_size).lean().exec()
    return {paginateData,total,page_index,totalPages}
  }

  async findOne(findOneOrderDto: FindOneOrderDto) {
    return await this.orderModel.find({_id: findOneOrderDto.order_id}).lean().exec()
  }

  async buildOrder({userData, amount, balance, order_type}) {
    const order = {
      user_id: userData._id,
      saas_name: userData.saas_name,
      phone_number: userData.phone_number,
      amount,
      balance,
      order_type,
      order_status: orderStatus.ALREADY
    }
    return await this.orderModel.create(order)
  }
  async checkUserId(user_id: string) {
    const userData = await this.userModel.findOne({_id: user_id})
    if(!userData) {
      await this.redisService.addLock(this.key)
      throw new HttpException('用户不存在',HttpStatus.BAD_REQUEST)
    }
    return userData
  }
  async changeBlance(userData, amount: string, order_type: orderType) {
    const balance = order_type === orderType.RECHARGE ? new Big(userData.balance).plus(amount).toString() : new Big(userData.balance).minus(amount).toString()
    const result = await this.userModel.updateOne({_id: userData._id},{$set: {balance}})
    const findData = await this.userModel.findOne({_id: userData._id}).lean()
    delete findData.password
    const redis = this.redisService.getClient()
    await redis.set(`opensaas:user:${userData._id}`,JSON.stringify(findData), 'EX', 3600)
    return balance
  }
}
