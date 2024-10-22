import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { SaasService } from './saas.service';
import { TokenSaasDto } from './dto/token-saas.dto';
import { User } from '../user/entities/user.entity';
import { StoreService } from '../store/store.service';
import { TokenType } from 'src/config/originConfig/origin';
import Big from 'big.js'
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

  @Get('findStoreList')
  async find(@Req() req:Request & {user:User & {tokenType: string}} & {ip: string} ) {
    if(req.user.tokenType !== TokenType.SAAS) throw new HttpException('token错误',HttpStatus.BAD_REQUEST)
    const userData = JSON.parse(await this.saasService.userRedis(req.user._id))
    if(userData.status===false) throw new HttpException('你的账号已被禁用，请联系管理员',HttpStatus.BAD_REQUEST)
    const ip = req.headers['x-forwarded-for']?req.headers['x-forwarded-for']:req.ip.replace(/::ffff:/g,'')//获取访问ip
    if(!userData.white_list.includes(ip)) throw new HttpException('该ip没有调用权限',HttpStatus.BAD_REQUEST)
    const data = await this.saasService.storeListRedis(userData.store_list)
    return {code: 200,message: "查询门店信息成功",data}
  }

  @Post('*')
  async service(@Req() req:Request & {user:User & {tokenType: string}} & {ip: string} ) {
    if(req.user.tokenType !== TokenType.SAAS) throw new HttpException('token错误',HttpStatus.BAD_REQUEST)
    const appid = req.user.appId
    const tokenData = JSON.stringify(req.user)
    const ip = req.headers['x-forwarded-for']?req.headers['x-forwarded-for']:req.ip.replace(/::ffff:/g,'')//获取访问ip
    const mcode: string = req.headers['mcode']
    if(!mcode) throw new HttpException('mcode未传入',HttpStatus.BAD_REQUEST)
    /**判断ip是否在白名单内 门店是否在该账号门店列表内 */  
    const userData = JSON.parse(await this.saasService.userRedis(req.user._id))
    if(userData.status===false) throw new HttpException('你的账号已被禁用，请联系管理员',HttpStatus.BAD_REQUEST)
    if(!userData.white_list.includes(ip)) throw new HttpException('该ip没有调用权限',HttpStatus.BAD_REQUEST)
    if(!userData.store_list.includes(mcode)) throw new HttpException('该mcode不在该saas账号下',HttpStatus.BAD_REQUEST)

    /**判断余额是否超出透支额度 */
    if(new Big(userData.credit_line || "0").plus(userData.balance) < 0) throw new HttpException('账号余额不足，请及时充值',HttpStatus.FORBIDDEN)

    /**以门店作为颗粒度总拦截 */
    const storeData = JSON.parse(await this.saasService.storeRedis(mcode))
    if(!storeData) throw new HttpException('门店不存在',HttpStatus.BAD_REQUEST)
    if(!storeData.api_list.includes(req.url)) throw new HttpException('该门店没有调用该接口权限',HttpStatus.BAD_REQUEST)

    /**以账号+门店为颗粒度拦截 */
    const permissData = JSON.parse(await this.saasService.permissRedis(mcode,req.user.appId))
    if(!permissData.api_list.includes(req.url)) throw new HttpException('该用户没有调用该门店该接口权限',HttpStatus.BAD_REQUEST)
    /**获取saas平台提供url，判断传入url是否正确 */
    let flag = false
    const apiData = JSON.parse(await this.saasService.apiRedis())
    for(const item of apiData) { if(item.saas_api === req.url) flag = true }
    if(!flag) throw new HttpException('接口错误，请检查您的url',HttpStatus.BAD_REQUEST)

    /**拼接映射的url */
    let map_api = storeData.saasapi + req.url.slice(4)
    const headers = {
      'Content-Type': 'application/json',
      'tokenData': req.user,
      'mcode': mcode,
      'appid': appid
    };
    const data = await this.saasService.axios(map_api,req.body, headers)
    return data
  }

}
