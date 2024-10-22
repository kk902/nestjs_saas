import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { HttpModule } from '@nestjs/axios';
import { MongoModule } from 'src/config/mongo/mongo.module';

@Module({
  imports: [
    MongoModule,
    HttpModule 
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
