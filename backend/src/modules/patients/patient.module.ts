import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { PatientDocument } from './patient-document.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { AuthModule } from '../auth/auth.module';
import { MediaModule } from '../../shared/media/media.module';
import { Profile } from '../profiles/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, PatientDocument, Profile]),
    AuthModule,
    MediaModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [TypeOrmModule, PatientService],
})
export class PatientsModule {}
