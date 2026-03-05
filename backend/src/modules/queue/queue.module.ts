import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');

        return redisUrl
          ? {
              connection: {
                url: redisUrl,
              },
            }
          : {
              connection: {
                host: 'localhost',
                port: 6379,
              },
            };
      },
    }),

    BullModule.registerQueue({
      name: 'shifts',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
