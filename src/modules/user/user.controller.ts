import { Controller, Post, Body, HttpException, HttpStatus, UseInterceptors, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FindAllUserDto } from './dto/findAll-user.dto';
import { FindOneUserDto } from './dto/findOne-user.dto';

import { User, UserRole } from './entities/user.entity';
import { IsArray, isArray, isBoolean, IsNotEmpty, IsNotEmptyObject } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto,@Req() req:Request & {user:User}) {
    if(req.user.role !== UserRole.ADMIN) throw new HttpException('无创建权限', HttpStatus.UNAUTHORIZED)
    let data = await this.userService.create(createUserDto);
    const userObject = data.toObject();
    delete userObject.password
    return {code: 200, message: "创建saas用户成功", data: userObject}
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const data = await this.userService.login(loginUserDto);
    return {code: 200, message: "登录成功",data}
  }

  @Post('find')
  async findOne(@Body() findOneUserDto: FindOneUserDto,@Req() req:Request & {user:User}) {
    if(req.user.role === UserRole.USER && Object.keys(findOneUserDto).length) 
      throw new HttpException('无查询其他用户权限', HttpStatus.UNAUTHORIZED)
    const user_id = findOneUserDto.user_id || req.user.user_id
    const data = await this.userService.findOne({user_id});
    delete data.password
    return {code: 200, message: "查询用户信息成功", data}
  }

  @Post('findAll')
  async findAll(@Body() findAllUserDto: FindAllUserDto,@Req() req:Request & {user:User}) {
    if(req.user.role === UserRole.USER) 
      throw new HttpException('无查询用户列表权限', HttpStatus.UNAUTHORIZED)
    const data = await this.userService.findAll(findAllUserDto);
    return {code: 200, message: "查询用户信息成功", data}
  }

  @Post('update')
  async update(@Body() updateUserDto: UpdateUserDto,@Req() req:Request & {user:User}) {
    if(req.user.role === UserRole.USER && updateUserDto.user_id) 
      throw new HttpException('无更改其他用户权限', HttpStatus.UNAUTHORIZED)
    if(req.user.role === UserRole.USER && updateUserDto.appId) 
      throw new HttpException('无更改appId权限', HttpStatus.UNAUTHORIZED)
    if(req.user.role === UserRole.USER && updateUserDto.status !== undefined) 
      throw new HttpException('无更改账号状态权限', HttpStatus.UNAUTHORIZED)
    if(req.user.role === UserRole.USER && updateUserDto.store_list) 
      throw new HttpException('无更改门店列表权限', HttpStatus.UNAUTHORIZED)
    updateUserDto.user_id = updateUserDto.user_id || req.user.user_id
    const data = await this.userService.update(updateUserDto);
    return {code: 200, message: "更新用户成功", data}
  }
}

