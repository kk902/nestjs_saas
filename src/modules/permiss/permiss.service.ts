import { Injectable } from '@nestjs/common';
import { Permiss } from './entities/permiss.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'src/config/redis/redis.service';
import { log } from 'console';

@Injectable()
export class PermissService {
  constructor(
    @InjectModel('Permiss') 
    private permissModel: Model<Permiss>,
    private readonly redisService: RedisService,
  ){}
  
  
  async setPermiss(permiss: Permiss) {
    const {appId, mcode} = permiss
    const result = await this.permissModel.updateOne({appId, mcode},{$set: permiss},{ upsert: true })
    const key = `opensaas:permiss:${mcode}:${appId}`
    const redis = this.redisService.getClient()
    const data = await this.permissModel.findOne({mcode,appId}).lean()
    await redis.set(key, JSON.stringify(data), 'EX', 3600)
    return data
  }
  async getPermiss(permiss: Permiss) {
    const {appId, mcode} = permiss
    const data = this.permissModel.find({appId, mcode}).lean().exec()
    return data
  }
}
