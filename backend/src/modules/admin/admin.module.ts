import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../patients/patient.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { CaregiverDocument } from '../caregivers/caregiver-document.entity';
import { Shift } from '../shifts/shift.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, Caregiver, CaregiverDocument, Shift]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
