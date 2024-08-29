import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongoModule } from 'src/config/mongo/mongo.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongoModule,
    HttpModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
