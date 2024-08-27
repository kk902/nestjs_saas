import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiSchema } from 'src/modules/api/schemas/api.schema';
import { PermissSchema } from 'src/modules/permiss/schema/permiss.schema';
import { SaasSchema } from 'src/modules/saas/schemas/saas.schema';
import { StoreSchema } from 'src/modules/store/schemas/store.schema';
import { UserSchema } from 'src/modules/user/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(), // 确保 ConfigModule 已经初始化
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        maxPoolSize: 10,
        minPoolSize: 5
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Saas', schema: SaasSchema, collection: "saas" },
      { name: 'User', schema: UserSchema, collection: "users" },
      { name: 'Store', schema: StoreSchema, collection: "stores" },
      { name: 'Api', schema: ApiSchema, collection: "apis" },
      { name: 'Permiss', schema: PermissSchema, collection: "permiss" }
    ]),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
