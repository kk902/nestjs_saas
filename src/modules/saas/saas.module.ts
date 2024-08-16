import { Module } from '@nestjs/common';
import { SaasService } from './saas.service';
import { SaasController } from './saas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SaasSchema } from './schemas/saas.schema';
import { AuthService } from 'src/config/service/AuthSservice';
import { UserSchema } from '../user/schemas/user.schema';
import { StoreSchema } from '../store/schemas/store.schema';
import { ApiSchema } from '../api/schemas/api.schema';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Saas', schema: SaasSchema, collection: "saas" },
      { name: 'User', schema: UserSchema, collection: "users" },
      { name: 'Store', schema: StoreSchema, collection: "stores" },
      { name: 'Api', schema: ApiSchema, collection: "apis" }
    ]),
    HttpModule
  ],
  controllers: [SaasController],
  providers: [SaasService, AuthService],
})
export class SaasModule {}
