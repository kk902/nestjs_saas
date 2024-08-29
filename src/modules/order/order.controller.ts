import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { RechargeOrderDto } from './dto/recharge-order.dto';
import { DeductOrderDto } from './dto/deduct-order.dto';
import { FindAllOrderDto } from './dto/findAll-order.dto';
import { User } from '../user/entities/user.entity';
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('recharge')
  async recharge(@Body() rechargeOrderDto: RechargeOrderDto) {
    const data = await this.orderService.recharge(rechargeOrderDto);
    return {code: 200, message: "充值订单完成", data}
  }

  @Post('deduct')
  async deduct(@Body() deductOrderDto : DeductOrderDto) {
    const data = await this.orderService.deduct(deductOrderDto)
    return {code: 200, message: "支付订单完成", data}
  }
  
  @Post('find')
  async findByUser(@Body() findOrderDto: FindAllOrderDto, @Req() req:Request & {user:User}) {
    if(req.user.user_id !== findOrderDto.user_id) throw new HttpException('无查询他人权限', HttpStatus.UNAUTHORIZED)
    const data = await this.orderService.findAll(findOrderDto)
    return {code: 200, message: "查询订单完成", data}
  }

  @Post('findAll')
  async findByAdmin(@Body() findAllOrderDto: FindAllOrderDto) {
    const data = await this.orderService.findAll(findAllOrderDto)
    return {code: 200, message: "查询订单完成", data}
  }
}
