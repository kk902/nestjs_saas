import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { StoreService } from './store.service';
import { UpdateStoreDto } from './dto/update-store.dto';
import { RoleGuard } from 'src/config/service/auth.guard';
import { FindOneStoreDto, FindAllStoreDto } from './dto/find-store.dto';
import { User, UserRole } from '../user/entities/user.entity';

@Controller('store')
@UseGuards(RoleGuard)
export class StoreController {
  constructor(
    private readonly storeService: StoreService
  ) {}
  @Post("sync") //同步门店
  async syncStore() {
    const data = await this.storeService.syncStore();
    return {code: 200, message: "同步成功"}
  }

  @Post('update')
  async update(@Body() updateStoreDto: UpdateStoreDto) {
    await this.storeService.update(updateStoreDto);
    return {code: 200, message: "更新门店api列表成功"}
  }

  @Post('find')
  async find(@Body() findOneStoreDto: FindOneStoreDto,@Req() req:Request & {user:User}) {
    if(findOneStoreDto.store_list && req.user.role === UserRole.USER) 
      throw new HttpException("权限不足",HttpStatus.FORBIDDEN)
    findOneStoreDto.store_list = findOneStoreDto.store_list || req.user.store_list
    const store_list = await this.storeService.find(findOneStoreDto);
    return {code: 200,message: "查询成功",data: {store_list}}
  }

  @Post("findAll")
  async findAll(@Body() findAllStoreDto: FindAllStoreDto) {
    const data = await this.storeService.findAll(findAllStoreDto);
    return {code: 200,message: "查询成功",data}
  }
}
