import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Caregiver } from './caregiver.entity';
import { CaregiverDocument } from './caregiver-document.entity';
import { CaregiverController } from './caregiver.controller';
import { CaregiverService } from './caregiver.service';
import { MediaModule } from '../../shared/media/media.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Caregiver, CaregiverDocument]),
    MediaModule,
  ],
  controllers: [CaregiverController],
  providers: [CaregiverService],
  exports: [CaregiverService],
})
export class CaregiversModule {}
