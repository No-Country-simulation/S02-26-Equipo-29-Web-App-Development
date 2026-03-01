import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Patient } from '../patients/patient.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { CaregiverDocument } from '../caregivers/caregiver-document.entity';
import { getWeekRanges, growth } from './utils';
import { Status } from '../caregivers/enums/caregiver-status.enum';
import { Shift } from '../shifts/shift.entity';
import { ShiftStatus } from '../shifts/enums/shift-status.enum';
import { PatientDocument } from '../patients/patient-document.entity';
import { Rating } from '../ratings/rating.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Caregiver)
    private readonly caregiverRepo: Repository<Caregiver>,
    @InjectRepository(CaregiverDocument)
    private readonly caregiverDocumentRepo: Repository<CaregiverDocument>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async getRegistrations() {
    const [patients, caregivers] = await Promise.all([
      this.patientRepo.find({
        relations: ['profile', 'documents'],
      }),
      this.caregiverRepo.find({
        relations: ['profile', 'documents'],
      }),
    ]);
    const patientsData = patients.map((patient) => {
      return {
        full_name: patient.profile.full_name,
        profile_id: patient.profile_id,
        phone: patient.profile.phone,
        created_at: patient.profile.created_at,
        status: patient.status,
        front_dni: patient.documents.find(
          (doc: PatientDocument) => doc.document_type === 'dni_front',
        )?.file_url,
        back_dni: patient.documents.find(
          (doc: PatientDocument) => doc.document_type === 'dni_back',
        )?.file_url,
        medical_history: patient.documents.find(
          (doc: PatientDocument) => doc.document_type === 'medical_history',
        )?.file_url,
      };
    });

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

    return { patients: patientsData, caregivers: caregiversData };
  }

  async getDashboard() {
    const { startOfWeek, endOfWeek, startOfLastWeek, endOfLastWeek } =
      getWeekRanges();

    const [
      patients,
      caregivers,
      patientsThisWeek,
      caregiversThisWeek,
      patientsLastWeek,
      caregiversLastWeek,
      shifts,
      hoursThisWeek,
      hoursLastWeek,
      ratingsThisWeek,
      ratingsLastWeek,
      ratings,
    ] = await Promise.all([
      this.patientRepo.count(),
      this.caregiverRepo.count({
        where: {
          status: Status.APPROVED,
        },
      }),
      this.patientRepo.count({
        where: { created_at: Between(startOfWeek, endOfWeek) },
      }),
      this.caregiverRepo.count({
        where: {
          status: Status.APPROVED,
          created_at: Between(startOfWeek, endOfWeek),
        },
      }),
      this.patientRepo.count({
        where: { created_at: Between(startOfLastWeek, endOfLastWeek) },
      }),
      this.caregiverRepo.count({
        where: {
          status: Status.APPROVED,
          created_at: Between(startOfLastWeek, endOfLastWeek),
        },
      }),
      this.shiftRepository.find({
        relations: ['caregiver', 'patient', 'patient.profile', 'approved_by'],
        order: {
          start_time: 'DESC',
        },
        take: 5,
        where: {
          status: ShiftStatus.PENDING,
        },
      }),
      this.shiftRepository.find({
        where: {
          status: ShiftStatus.COMPLETED,
          start_time: Between(startOfWeek, endOfWeek),
        },
        select: ['hours'],
      }),
      this.shiftRepository.find({
        where: {
          status: ShiftStatus.COMPLETED,
          start_time: Between(startOfLastWeek, endOfLastWeek),
        },
        select: ['hours'],
      }),
      this.ratingRepository.count({
        where: { createdAt: Between(startOfWeek, endOfWeek) },
      }),
      this.ratingRepository.count({
        where: { createdAt: Between(startOfLastWeek, endOfLastWeek) },
      }),
      this.ratingRepository.find(),
    ]);

    const hoursSumThisWeek = hoursThisWeek.reduce(
      (acc, shift) => acc + Number(shift.hours),
      0,
    );
    const hoursSumLastWeek = hoursLastWeek.reduce(
      (acc, shift) => acc + Number(shift.hours),
      0,
    );

    const ratingsSum = ratings.reduce((acc, rating) => {
      return acc + Number(rating.number);
    }, 0);
    const ratingsAverage = ratingsSum / ratings.length;

    return {
      patients: {
        total: patients,
        growth: growth(patientsThisWeek, patientsLastWeek),
      },
      caregivers: {
        total: caregivers,
        growth: growth(caregiversThisWeek, caregiversLastWeek),
      },
      shifts: shifts,
      hours: {
        hours: hoursSumThisWeek.toFixed(2),
        growth: growth(hoursSumThisWeek, hoursSumLastWeek),
      },
      ratings: {
        ratings: ratingsAverage.toFixed(2),
        growth: growth(ratingsThisWeek, ratingsLastWeek),
      },
    };
  }
}
