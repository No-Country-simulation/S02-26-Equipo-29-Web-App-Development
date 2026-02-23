// src/modules/ratings/ratings.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rating } from './rating.entity';
import { Shift } from '../shifts/shift.entity';

import { RatingsService } from './rating.service';
import { RatingsController } from './rating.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Shift])],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
