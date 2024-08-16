import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiSchema } from './schemas/api.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Api', schema: ApiSchema, collection: "apis" }])
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
