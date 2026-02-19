import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './shift.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { Patient } from '../patients/patient.entity';
import { ShiftsService } from './shift.service';
import { ShiftsController } from './shift.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Caregiver, Patient])],
  controllers: [ShiftsController],
  providers: [ShiftsService],
})
export class ShiftsModule {}
