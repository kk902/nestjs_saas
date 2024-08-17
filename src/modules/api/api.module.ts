import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { MongoModule } from 'src/config/mongo/mongo.module';

@Module({
  imports: [
    MongoModule
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
