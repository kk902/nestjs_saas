import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        maxPoolSize: 10,
        minPoolSize: 5,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
