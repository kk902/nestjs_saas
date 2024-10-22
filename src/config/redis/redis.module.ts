import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service'; // 确保路径正确

@Global()
@Module({
  imports: [ConfigModule], // 确保 ConfigModule 已经被导入
  providers: [RedisService],
  exports: [RedisService], // 导出 RedisService 以便其他模块使用
})
export class RedisModule {}
