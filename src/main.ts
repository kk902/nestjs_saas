import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

import { AllExceptionsFilter } from './config/service/AllExceptionsFilter ';

import { HttpInterceptor } from './config/service/http.interceptor';
import { logger } from './config/service/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{cors:true,logger:false});
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 去除 DTO 中没有定义的字段
    forbidNonWhitelisted: true, // 拒绝 DTO 中没有定义的字段
    transform: true, // 自动将请求数据转换为 DTO 实例
  }));
  app.useStaticAssets('public',{
    prefix: '/static/'
  })
  app.useGlobalFilters(new AllExceptionsFilter())
  
  app.useLogger(logger);
  app.useGlobalInterceptors( new HttpInterceptor(logger))

  // app.useGlobalFilters(new HttpExceptionFilter())
  //配置模板引擎
  app.setBaseViewsDir('views')
  app.setViewEngine('ejs')
  await app.listen(3000);
  logger.warn("项目启动成功.....")
}
bootstrap();
