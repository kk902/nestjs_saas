import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenSaasDto } from './dto/token-saas.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'src/config/redis/redis.service';
import { Saas } from './entities/saa.entity';
import { User } from '../user/entities/user.entity';
import { AuthService } from 'src/config/service/AuthSservice';
import { Store } from '../store/entities/store.entity';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { TokenType } from 'src/config/originConfig/origin';
import { Permiss } from '../permiss/entities/permiss.entity';

@Injectable()
export class SaasService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel('Saas') 
    private saasModel: Model<Saas>,

    private readonly authService: AuthService,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Store') private storeModel: Model<Store>,
    @InjectModel('Api') private apiModel: Model<Store>,
    @InjectModel('Permiss') private permissModel: Model<Permiss>,
    private readonly httpService: HttpService,
  ){}
  async getToken(tokenSaasDto: TokenSaasDto) {
    // const key = `saas:token:${tokenSaasDto.appId}:${tokenSaasDto.key}`
    // const redis = this.redisService.getClient()
    // const token = await redis.get(key)
    // if(token) return token
    const userData = await this.userModel.findOne(tokenSaasDto).lean().exec()
    if(!userData) throw new HttpException("获取失败，请检查参数",HttpStatus.NOT_FOUND)
    delete userData.password
    const saasData = Object.assign({tokenType: TokenType.SAAS},userData)
    const token = await this.authService.generateToken(saasData)
    return token
  }

  async userRedis(user_id: string) {
    const key = `opensaas:user:${user_id}`
    const redis = this.redisService.getClient()
    const data = await redis.get(key)
    if(data) return data
    const newData = await this.userModel.findOne({_id: user_id}).lean()
    if(!newData) throw new HttpException("用户不存在", HttpStatus.NOT_FOUND)
    delete newData.password
    await redis.set(key, JSON.stringify(newData), 'EX', 3600)
    return await redis.get(key)
  }

  async storeRedis(mcode: string) {
    const key = `opensaas:store:${mcode}`
    const redis = this.redisService.getClient()
    const data = await redis.get(key)
    if(data) return data
    const newData = await this.storeModel.findOne({mcode}).lean()
    if(!newData) throw new HttpException("门店不存在", HttpStatus.NOT_FOUND)
    await redis.set(key, JSON.stringify(newData), 'EX', 3600)
    return await redis.get(key)
  }

  async apiRedis() {
    const key = `opensaas:api`
    const redis = this.redisService.getClient()
    const data = await redis.get(key)
    if(data) return data
    const newData = await this.apiModel.find().lean()
    if(!newData) throw new HttpException("api列表不存在", HttpStatus.NOT_FOUND)
    await redis.set(key, JSON.stringify(newData), 'EX', 3600)
    return await redis.get(key)
  }

  async permissRedis(mcode: string,appId: string) {
    const key = `opensaas:permiss:${mcode}:${appId}`
    const redis = this.redisService.getClient()
    const data = await redis.get(key)
    if(data) return data
    const newData = await this.permissModel.findOne({mcode,appId}).lean()
    if(!newData) throw new HttpException("权限映射不存在", HttpStatus.NOT_FOUND)
    await redis.set(key, JSON.stringify(newData), 'EX', 3600)
    return await redis.get(key)
  }

  async axios(url: string,data: object, mcode: string) : Promise<object> {
    const response = await firstValueFrom(this.httpService.post(url, data,{ headers: {mcode} }));
    return response.data
  }
  
}
