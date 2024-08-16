import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AuthService } from 'src/config/service/AuthSservice';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema, collection: "users" }]),
    HttpModule
  ],
  controllers: [UserController],
  providers: [UserService,AuthService]
})
export class UserModule {}
