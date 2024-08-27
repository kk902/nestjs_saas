import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './config/service/auth.middleware';
import { RedisModule } from './config/redis/redis.module'; // 确保路径正确
import { MongoModule } from './config/mongo/mongo.module';
//导入模块
import { UserModule } from './modules/user/user.module';
import { ApiModule } from './modules/api/api.module';
import { StoreModule } from './modules/store/store.module';
import { SaasModule } from './modules/saas/saas.module';
import { PermissModule } from './modules/permiss/permiss.module';
import { OrderModule } from './modules/order/order.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),//加载.env
    MongoModule,//连接MongoDB
    RedisModule,//连接redis 并提供
    UserModule,
    ApiModule,
    StoreModule,
    PermissModule,
    JwtModule.register({
      secret: 'this is a secret', // 你可以把这个值放在环境变量中
      signOptions: { expiresIn: '10h' }, // 设置 token 过期时间
      global:true
    }),
    SaasModule,
    OrderModule,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        req.app.set('trust proxy', true); // 配置信任代理
        next();
      }, AuthMiddleware)
      .exclude(
        { path: 'user/login', method: RequestMethod.POST },
        { path: 'openSaas/getToken', method: RequestMethod.POST }
      )
      .forRoutes('*')
  }
}
