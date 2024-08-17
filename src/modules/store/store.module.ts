import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Storedb,StoreSchema } from './schemas/store.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Storedb.name, schema: StoreSchema, collection: "stores" }]),
    HttpModule 
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
