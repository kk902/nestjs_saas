import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { SaasService } from './saas.service';
import { TokenSaasDto } from './dto/token-saas.dto';
import { User } from '../user/entities/user.entity';
import { StoreService } from '../store/store.service';
@Controller('openSaas')
export class SaasController {
  constructor(
    private readonly saasService: SaasService,
    // private storeService: StoreService,
  ) {}

  @Post('getToken')
  async getToken(@Body() tokenSaasDto: TokenSaasDto) {
    const token = await this.saasService.getToken(tokenSaasDto);
    return {code: 200, message: "token获取成功", data: {token}}
  }

  @Post('find')
  async find(@Req() req:Request & {user:User}) {
    return req.user
  }

  @Post('*')
  async service(@Req() req:Request & {user:User} & {ip: string}) {
    const ip = req.headers['x-forwarded-for']?req.headers['x-forwarded-for']:req.ip.replace(/::ffff:/g,'')//获取访问ip
    const mcode: string = req.headers['mcode']
    if(!mcode) throw new HttpException('mcode未传入',HttpStatus.BAD_REQUEST)

    const userData = JSON.parse(await this.saasService.userRedis(req.user._id))
    
    const apiData = JSON.parse(await this.saasService.apiRedis())
    if(!userData.white_list.includes(ip)) throw new HttpException('该ip没有调用权限',HttpStatus.BAD_REQUEST)
    if(!userData.store_list.includes(mcode)) throw new HttpException('该mcode不在该saas账号下',HttpStatus.BAD_REQUEST)

      const storeData = JSON.parse(await this.saasService.storeRedis(mcode))
      if(!storeData) throw new HttpException('门店不存在',HttpStatus.BAD_REQUEST)
    
    if(!storeData.api_list.includes(req.url)) throw new HttpException('该门店没有调用该接口权限',HttpStatus.BAD_REQUEST)
    
    let map_api = ''
    for(const item of apiData) { if(item.saas_api === req.url) map_api = item.map_api }
    if(!map_api) throw new HttpException('未查询到该接口映射',HttpStatus.BAD_REQUEST)
    const data = await this.saasService.axios(map_api,req.body)
    return data
  }

}
