import { Global, Module } from '@nestjs/common';
import { RedisModule as IoRedisModule } from '@nestjs-modules/ioredis';
import { RedisConfig } from '@config/redis.config';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    IoRedisModule.forRoot({
      url: RedisConfig.url,
      type: 'single',
      options: {
        ...RedisConfig.getConnectionOptions(),
        password: RedisConfig.password,
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
