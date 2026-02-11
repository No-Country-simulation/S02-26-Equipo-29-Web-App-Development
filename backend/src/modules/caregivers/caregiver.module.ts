import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Caregiver } from './caregiver.entity';
import { CaregiverDocument } from './caregiver-document.entity';
import { CaregiverController } from './caregiver.controller';
import { CaregiverService } from './caregiver.service';

@Module({
  imports: [TypeOrmModule.forFeature([Caregiver, CaregiverDocument])],
  controllers: [CaregiverController],
  providers: [CaregiverService],
  exports: [TypeOrmModule, CaregiverService],
})
export class CaregiversModule {}
