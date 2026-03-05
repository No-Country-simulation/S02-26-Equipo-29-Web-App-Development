import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './shift.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { Patient } from '../patients/patient.entity';
import { ShiftsService } from './shift.service';
import { ShiftsController } from './shift.controller';
import { Profile } from '../profiles/profile.entity';
import { QueueModule } from '../queue/queue.module';
import { ShiftsConsumer } from './shift.processor';
import { MailService } from '../email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift, Caregiver, Patient, Profile]),
    QueueModule,
  ],
  controllers: [ShiftsController],
  providers: [ShiftsService, ShiftsConsumer, MailService],
})
export class ShiftsModule {}
