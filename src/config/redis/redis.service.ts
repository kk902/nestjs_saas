import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      const redisUrl = this.configService.get<string>('REDIS_URL');
      if (!redisUrl) {
        throw new Error('REDIS_URL not configured');
      }
      
      this.redisClient = new Redis(redisUrl, {
        // 可选配置项
        retryStrategy: times => Math.min(times * 50, 2000),
      });

      this.redisClient.on('error', (err) => {
        this.logger.error('Redis error', err);
      });

      this.redisClient.on('connect', () => {
        this.logger.log('Connected to Redis');
      });
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error.stack);
      throw error;  // Ensure the application does not start if Redis connection fails
    }
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      try {
        await this.redisClient.quit();
        this.logger.log('Redis client disconnected');
      } catch (error) {
        this.logger.error('Failed to disconnect Redis client', error.stack);
      }
    }
  }

  getClient() {
    return this.redisClient;
  }
}
