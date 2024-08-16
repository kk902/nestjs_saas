import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PermissService } from './permiss.service';
import { SetPermissDto } from './dto/permiss-set.dto';
import { GetPermissDto } from './dto/permiss-get.dto';
import { RoleGuard } from 'src/config/service/auth.guard';

@Controller('permiss')
@UseGuards(RoleGuard)
export class PermissController {
  constructor(private readonly permissService: PermissService) {}


  @Post('setPermiss') 
  async setPermiss(@Body() permissDto: SetPermissDto) {
    const data = await this.permissService.setPermiss(permissDto)
    return {code: 200,message: "配置门店映射成功", data}
  }
  
  @Post('getPermiss') 
  async getPermiss(@Body() permissDto: GetPermissDto) {
    const data = await this.permissService.getPermiss(permissDto)
    return {code: 200,message: "获取门店映射成功", data}
  }
}
