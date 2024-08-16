import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Store } from './entities/store.entity';
import { Model } from 'mongoose';
import { RedisService } from 'src/config/redis/redis.service';
import { InjectModel } from '@nestjs/mongoose';
import { isArray } from 'class-validator';
import { FindAllStoreDto, FindOneStoreDto } from './dto/find-store.dto';

@Injectable()
export class StoreService {
  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
    @InjectModel('Store') private storeModel: Model<Store>,
  ) {}
  async syncStore() {
    const SyncStore = {
      api: `${process.env.SYNCDATA_URL}/dev_bsu_hgr/getHost`,
      data: {"title": "all"}
    }
    const response = await firstValueFrom(this.httpService.post(SyncStore.api, SyncStore.data));
    const storeData = response?.data?.data
    if(!isArray(storeData)) throw new HttpException('获取门店数据错误', HttpStatus.NO_CONTENT);
    for(const item of storeData) {
      delete item._id
      const mcode = item.mcode
      await this.storeModel.updateOne({ mcode },{ $set: item },{ upsert: true })
    }
    return 
  }

  async update(updateStoreDto: Store) {
    const {mcode,api_list} = updateStoreDto
    const data = await this.findOne({mcode})
    if(!data) throw new HttpException('门店不存在', HttpStatus.NOT_FOUND)
    const updateData = await this.updateOne({mcode, api_list})
    if(!updateData.matchedCount ) throw new HttpException('更新失败', HttpStatus.NOT_FOUND)
    const storeData = await this.findOne({mcode})
    const redis = this.redisService.getClient()
    await redis.set(`opensaas:store:${mcode}`,JSON.stringify(storeData), 'EX', 3600)
  }
  async find({store_list}: FindOneStoreDto) {
    return this.storeModel.find({mcode: { $in: store_list}}).lean().exec()
  }
  async findAll(findAllUserDto: FindAllStoreDto) {
    const {page_index, page_size} = findAllUserDto
    const total = await this.storeModel.countDocuments().exec();
    const skip = (page_index - 1) * page_size
    const totalPages = Math.ceil(total / page_size)
    if(skip >= total) throw new HttpException('超出页数限制', HttpStatus.FORBIDDEN);
    const paginateData = await this.storeModel.find().skip(skip).limit(page_size).lean().exec()
    return {paginateData,total,page_index,totalPages}
  }

  async findOne({mcode}) {
    return this.storeModel.findOne({mcode}).lean()
  }

  updateOne({mcode, api_list}) {
    return this.storeModel.updateOne({mcode}, {$set: {api_list}})

  }
}
