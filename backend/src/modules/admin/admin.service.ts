import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Patient } from '../patients/patient.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { CaregiverDocument } from '../caregivers/caregiver-document.entity';
import { getWeekRanges, growth } from './utils';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Caregiver)
    private readonly caregiverRepo: Repository<Caregiver>,
    @InjectRepository(CaregiverDocument)
    private readonly caregiverDocumentRepo: Repository<CaregiverDocument>,
  ) {}

  async getRegistrations() {
    const [patients, caregivers] = await Promise.all([
      this.patientRepo.find({
        relations: ['profile'],
      }),
      this.caregiverRepo.find({
        relations: ['profile', 'documents'],
      }),
    ]);
    const caregiversData = caregivers.map((caregiver) => {
      return {
        full_name: caregiver.profile.full_name,
        profile_id: caregiver.profile_id,
        phone: caregiver.phone,
        cbu: caregiver.cbu,
        mercado_pago_alias: caregiver.mercado_pago_alias,
        hourly_rate: caregiver.hourly_rate,
        is_verified: caregiver.is_verified,
        created_at: caregiver.profile.created_at,
        status: caregiver.status,
        front_dni: caregiver.documents.find(
          (doc: CaregiverDocument) => doc.document_type === 'dni_front',
        )?.file_url,
        back_dni: caregiver.documents.find(
          (doc: CaregiverDocument) => doc.document_type === 'dni_back',
        )?.file_url,
        criminal_record: caregiver.documents.find(
          (doc: CaregiverDocument) => doc.document_type === 'criminal_record',
        )?.file_url,
        certificate: caregiver.documents.find(
          (doc: CaregiverDocument) => doc.document_type === 'certificate',
        )?.file_url,
        contract: caregiver.documents.find(
          (doc: CaregiverDocument) => doc.document_type === 'contract',
        )?.file_url,
      };
    });
    return { patients, caregivers: caregiversData };
  }

  async getDashboard() {
    const { startOfWeek, endOfWeek, startOfLastWeek, endOfLastWeek } =
      getWeekRanges();

    const [
      patientsThisWeek,
      caregiversThisWeek,
      patientsLastWeek,
      caregiversLastWeek,
    ] = await Promise.all([
      this.patientRepo.count({
        where: { created_at: Between(startOfWeek, endOfWeek) },
      }),
      this.caregiverRepo.count({
        where: { created_at: Between(startOfWeek, endOfWeek) },
      }),
      this.patientRepo.count({
        where: { created_at: Between(startOfLastWeek, endOfLastWeek) },
      }),
      this.caregiverRepo.count({
        where: { created_at: Between(startOfLastWeek, endOfLastWeek) },
      }),
    ]);

    return {
      patients: {
        total: patientsThisWeek,
        growth: growth(patientsThisWeek, patientsLastWeek),
      },
      caregivers: {
        total: caregiversThisWeek,
        growth: growth(caregiversThisWeek, caregiversLastWeek),
      },
    };
  }
}
