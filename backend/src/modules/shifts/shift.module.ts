import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './shift.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { Patient } from '../patients/patient.entity';
import { ShiftsService } from './shift.service';
import { ShiftsController } from './shift.controller';
import { Profile } from '../profiles/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Caregiver, Patient, Profile])],
  controllers: [ShiftsController],
  providers: [ShiftsService],
})
export class ShiftsModule {}
