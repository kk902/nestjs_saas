import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { Api } from './entities/api.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RedisService } from 'src/config/redis/redis.service';

@Injectable()
export class ApiService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel('Api') private apiModel: Model<Api>
  ) {}
  async create(createApiDto: CreateApiDto) {
    const findData = await this.findOne({saas_api: createApiDto.saas_api})
    if(findData) throw new HttpException('api已经存在', HttpStatus.FORBIDDEN);
    await this.apiModel.create(createApiDto)
    await this.updateRedis()
    return true
  }
  async remove(filter: Api) {
    const findData = await this.findOne(filter)
    if(!findData) throw new HttpException('api不存在', HttpStatus.NOT_FOUND);
    const data = await this.apiModel.deleteOne(filter)
    await this.updateRedis()
    return true
  }
  findAll() {
    return this.apiModel.find().lean().exec()
  }

  findOne(filter: Api) {
    return this.apiModel.findOne(filter).lean().exec()
  }
  async updateRedis() {
    const apiData = await this.apiModel.find()
    const redis = this.redisService.getClient()
    await redis.set(`opensaas:api`,JSON.stringify(apiData), 'EX', 3600)
  }
  
}
