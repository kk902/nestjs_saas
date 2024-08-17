import { Module } from '@nestjs/common';
import { PermissService } from './permiss.service';
import { PermissController } from './permiss.controller';
import { AuthService } from 'src/config/service/AuthSservice';
import { MongoModule } from 'src/config/mongo/mongo.module';

@Module({
  imports: [
    MongoModule
  ],
  controllers: [PermissController],
  providers: [PermissService,AuthService],
})
export class PermissModule {}
