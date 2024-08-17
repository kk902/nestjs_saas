import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { RoleGuard } from 'src/config/service/auth.guard';
import { RemoveApiDto } from './dto/remove-api.dto';
import { User, UserRole } from '../user/entities/user.entity';

@Controller('api_mannage')
@UseGuards(RoleGuard)
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('create')
  async create(@Body() createApiDto: CreateApiDto) {
    const data = await this.apiService.create(createApiDto);
    return {code: 200,message: '创建api成功'}
  }

  @Post('remove')
  async remove(@Body() removeApiDto: RemoveApiDto) {
    const data = await this.apiService.remove(removeApiDto);
    return {code: 200,message: '删除api成功'}
  }

  @Post('find')
  async findAll(@Req() req:Request & {user:User}) {
    const api_list = await this.apiService.findAll();
    return {code: 200,message: '查询api列表成功', data: {api_list}}
  }
}
