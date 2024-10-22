import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from 'src/config/service/AuthSservice';
import { HttpModule } from '@nestjs/axios';
import { MongoModule } from 'src/config/mongo/mongo.module';
import { logger } from 'src/config/service/logger';
//import { LoggerModule } from 'src/config/service/logger.module';

@Module({
  imports: [
    MongoModule,
    HttpModule,
    //LoggerModule
  ],
  controllers: [UserController],
  providers: [UserService,AuthService]
  
})
export class UserModule {}
