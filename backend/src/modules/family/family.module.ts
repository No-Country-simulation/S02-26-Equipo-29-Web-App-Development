import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyPatient } from './family-patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyPatient])],
  exports: [TypeOrmModule],
})
export class FamilyModule {}
