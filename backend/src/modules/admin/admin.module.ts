import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../patients/patient.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { CaregiverDocument } from '../caregivers/caregiver-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Caregiver, CaregiverDocument])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
