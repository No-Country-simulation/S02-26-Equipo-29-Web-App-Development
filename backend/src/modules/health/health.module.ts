import { Module } from '@nestjs/common';
import { HealthController } from './index';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
