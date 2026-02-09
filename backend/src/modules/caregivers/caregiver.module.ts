import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Caregiver } from './caregiver.entity';
import { CaregiverDocument } from './caregiver-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caregiver, CaregiverDocument])],
  exports: [TypeOrmModule],
})
export class CaregiversModule {}
