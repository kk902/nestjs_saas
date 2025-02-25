import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose'
import { User, UserRole } from '../user/entities/user.entity';
import { RedisService } from 'src/config/redis/redis.service';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/config/service/AuthSservice';
import { FindAllUserDto } from './dto/findAll-user.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Store } from '../store/entities/store.entity';
import { CreditLineDto } from './dto/creditLine-user.dto';




@Injectable()
export class UserService {

  private readonly logger = new Logger("logger");
  constructor(
    private readonly redisService: RedisService,

    @InjectModel('User') 
    private userModel: Model<User>,

    private readonly authService: AuthService,

    private readonly httpService: HttpService,

    @InjectModel('Store') 
    private storeModel: Model<Store>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const {phone_number} = createUserDto
    const userData = await this.findOne({phone_number})
    if(userData) throw new HttpException('用户已经存在', HttpStatus.FORBIDDEN);
    createUserDto.password = await this.authService.hashPassword(createUserDto.password)
    const createDate = await this.userModel.create(createUserDto)
    await this.userModel.updateOne({_id: createDate._id},{$set: { appId: createDate._id}})
    createDate.appId = createDate._id
    return createDate
  }

  async login(loginUserDto: LoginUserDto) {
    const {phone_number, password} = loginUserDto
    const userData = await this.findOne({phone_number})
    if(!userData) throw new HttpException('该手机号未注册', HttpStatus.FORBIDDEN);
    if(userData.status === false) throw new HttpException("该账户已被禁用，请联系管理员",HttpStatus.FORBIDDEN)
    const flag = await this.authService.comparePasswords(password , userData.password)
    if(!flag) throw new HttpException('密码错误', HttpStatus.UNAUTHORIZED);
    const token = await this.authService.generateToken(userData)
    return {token,...userData}
  }

  async findAll(findAllUserDto: FindAllUserDto) {
    const {page_index, page_size} = findAllUserDto
    const total = await this.userModel.countDocuments().exec();
    if(!total) {
      return {paginateData: [],total,page_index,totalPages: 0}
    }
    const skip = (page_index - 1) * page_size
    const totalPages = Math.ceil(total / page_size)
    if(skip >= total) throw new HttpException('超出页数限制', HttpStatus.FORBIDDEN);
    const paginateData = await this.userModel.find().select('-password').skip(skip).limit(page_size).lean().exec()
    return {paginateData,total,page_index,totalPages}
  }

  findOne({user_id, phone_number}: User): Promise<User> {
    if(user_id) return this.userModel.findOne({_id: user_id}).lean().exec()
    if(phone_number) return this.userModel.findOne({phone_number}).lean().exec()
  }

  async update(updateUserDto: UpdateUserDto) {
    const userData = await this.findOne({user_id: updateUserDto.user_id})
    if(!userData) throw new HttpException('用户不存在', HttpStatus.UNAUTHORIZED);
    if(userData.role === UserRole.ADMIN && updateUserDto.status === false) 
      throw new HttpException('无权限禁用管理员', HttpStatus.UNAUTHORIZED);
    if(updateUserDto.password) {
      const flag = await this.authService.comparePasswords(updateUserDto.oldPassword , userData.password)
      if(!flag) throw new HttpException('密码错误', HttpStatus.UNAUTHORIZED);
    }
    const user_id = updateUserDto.user_id
    delete updateUserDto.user_id
    delete updateUserDto.oldPassword
    if(updateUserDto.password) updateUserDto.password = await this.authService.hashPassword(updateUserDto.password)
    const data = await this.userModel.updateOne({_id: user_id}, { $set: updateUserDto })
    if(!data.matchedCount ) throw new HttpException("更改失败",HttpStatus.INTERNAL_SERVER_ERROR)
    const findData = await this.findOne({user_id})
    delete findData.password
    const redis = this.redisService.getClient()
    await redis.set(`opensaas:user:${user_id}`,JSON.stringify(findData), 'EX', 3600)
    /**同步用户数据 */
    this.SyncData(findData)
    return findData
  }

  async configcreditLine(creditLineDto: CreditLineDto) {
    const { user_list, credit_line } = creditLineDto
    const data = []
    for(const user_id of user_list) {
      const result = await this.userModel.updateOne({_id: user_id}, {$set: {credit_line}})
      const findData = await this.findOne({user_id})
      delete findData.password
      const redis = this.redisService.getClient()
      await redis.set(`opensaas:user:${user_id}`,JSON.stringify(findData), 'EX', 3600)
      data.push(findData)
    }
    return data
  }

  async SyncData(findData: User) {
    const tokenUrl = []
    if(findData.test_callback && findData.test_callback.status) tokenUrl.push({url: findData.test_callback.url})
    if(findData.product_callback && findData.product_callback.status) tokenUrl.push({url: findData.product_callback.url})
    const syncData = {
      appid: findData.appId,
      tokenUrl,
      mcode: findData.store_list,
      name: findData.saas_name,
      phone: findData.phone_number,
    }
    const group = await this.getOnePerGroup()
    // //上传用户回调
    for(const item of group) {
      const syncDataUrl = `${item.saasapi}/openSaas/setSassUser`
      const response = await firstValueFrom(this.httpService.post(syncDataUrl,syncData)).catch(error=>{
      this.logger.error(`用户数据同步失败${syncDataUrl}`,error?.message)
      })
    }
    
    return syncData
  }

  async getOnePerGroup() {
    const result = await this.storeModel.aggregate([
      {
        $group: {
          _id: '$dbname',          // 按 dbname 字段分组
          document: { $first: "$$ROOT" } // 选择每组中的第一个文档
        }
      },
      {
        $replaceRoot: { newRoot: "$document" } // 将每组中的文档提升为根文档
      },
      {
        $sort: { _id: 1 } // 可选：按 _id 排序（可以根据需要修改或删除）
      }
    ]);
    return result;
  }

}
