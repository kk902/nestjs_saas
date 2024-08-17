import { Module } from '@nestjs/common';
import { SaasService } from './saas.service';
import { SaasController } from './saas.controller';
import { AuthService } from 'src/config/service/AuthSservice';
import { HttpModule } from '@nestjs/axios';
import { MongoModule } from 'src/config/mongo/mongo.module';
@Module({
  imports: [
    MongoModule,
    HttpModule
  ],
  controllers: [SaasController],
  providers: [SaasService, AuthService],
})
export class SaasModule {}
