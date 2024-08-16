import { Module } from '@nestjs/common';
import { PermissService } from './permiss.service';
import { PermissController } from './permiss.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissSchema } from './schema/permiss.schema';
import { AuthService } from 'src/config/service/AuthSservice';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Permiss', schema: PermissSchema, collection: "permiss" }]),
  ],
  controllers: [PermissController],
  providers: [PermissService,AuthService],
})
export class PermissModule {}
