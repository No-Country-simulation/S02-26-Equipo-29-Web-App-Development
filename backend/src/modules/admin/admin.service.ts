import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { Patient } from '../patients/patient.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { CaregiverDocument } from '../caregivers/caregiver-document.entity';
import { getMonthRanges, growth } from './utils';
import { Status } from '../caregivers/enums/caregiver-status.enum';
import { Shift } from '../shifts/shift.entity';
import { ShiftStatus } from '../shifts/enums/shift-status.enum';
import { PatientDocument } from '../patients/patient-document.entity';
import { Rating } from '../ratings/rating.entity';
import { PatientStatus } from '../patients/enums/patient-status-enum';

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
    const { startOfMonth, endOfMonth, startOfLastMonth, endOfLastMonth } =
      getMonthRanges();

    const [
      patients,
      caregivers,
      patientsThisMonth,
      caregiversThisMonth,
      patientsLastMonth,
      caregiversLastMonth,
      shifts,
      hoursThisMonth,
      hoursLastMonth,
      ratingsThisMonth,
      ratingsLastMonth,
      ratings,
    ] = await Promise.all([
      this.patientRepo.count({
        where: {
          status: PatientStatus.APPROVED,
        },
      }),
      this.caregiverRepo.count({
        where: {
          status: Status.APPROVED,
        },
      }),
      this.patientRepo.count({
        where: {
          status: PatientStatus.APPROVED,
          created_at: Between(startOfMonth, endOfMonth),
        },
      }),
      this.caregiverRepo.count({
        where: {
          status: Status.APPROVED,
          created_at: Between(startOfMonth, endOfMonth),
        },
      }),
      this.patientRepo.count({
        where: { created_at: Between(startOfLastMonth, endOfLastMonth) },
      }),
      this.caregiverRepo.count({
        where: {
          status: Status.APPROVED,
          created_at: Between(startOfLastMonth, endOfLastMonth),
        },
      }),
      this.shiftRepository.find({
        relations: ['caregiver', 'patient', 'patient.profile', 'approved_by'],
        order: {
          start_time: 'ASC',
        },
        take: 5,
        where: {
          status: ShiftStatus.PENDING,
        },
      }),
      this.shiftRepository.find({
        where: {
          status: ShiftStatus.COMPLETED,
          start_time: Between(startOfMonth, endOfMonth),
        },
        select: ['hours'],
      }),
      this.shiftRepository.find({
        where: {
          status: ShiftStatus.COMPLETED,
          start_time: Between(startOfLastMonth, endOfLastMonth),
        },
        select: ['hours'],
      }),
      this.ratingRepository.count({
        where: { createdAt: Between(startOfMonth, endOfMonth) },
      }),
      this.ratingRepository.count({
        where: { createdAt: Between(startOfLastMonth, endOfLastMonth) },
      }),
      this.ratingRepository.find(),
    ]);

    const hoursSumThisMonth = hoursThisMonth.reduce(
      (acc, shift) => acc + Number(shift.hours),
      0,
    );
    const hoursSumLastMonth = hoursLastMonth.reduce(
      (acc, shift) => acc + Number(shift.hours),
      0,
    );

    const ratingsSum = ratings.reduce((acc, rating) => {
      return acc + Number(rating.number);
    }, 0);
    const ratingsAverage = ratings.length > 0 ? ratingsSum / ratings.length : 0;

    return {
      patients: {
        total: patients,
        growth: growth(patientsThisMonth, patientsLastMonth),
      },
      caregivers: {
        total: caregivers,
        growth: growth(caregiversThisMonth, caregiversLastMonth),
      },
      shifts: shifts,
      hours: {
        hours: hoursSumThisMonth.toFixed(2),
        growth: growth(hoursSumThisMonth, hoursSumLastMonth),
      },
      ratings: {
        ratings: ratingsAverage.toFixed(2),
        growth: growth(ratingsThisMonth, ratingsLastMonth),
      },
    };
  }

  async getAvailableCaregivers(start_time?: string, end_time?: string) {
    let excludedCaregiverIds: string[] = [];

    if (start_time && end_time) {
      const start = new Date(start_time);
      const end = new Date(end_time);

      // Encontrar todos los turnos que se solapan con el rango dado
      // y que están en un estado que bloquea la disponibilidad
      const conflictingShifts = await this.shiftRepository.find({
        where: {
          start_time: LessThan(end),
          end_time: MoreThan(start),
          status: In([
            ShiftStatus.ASSIGNED,
            ShiftStatus.IN_PROGRESS,
            ShiftStatus.COMPLETED,
          ]),
          caregiver: Not(null),
        },
        relations: ['caregiver'],
      });

      excludedCaregiverIds = conflictingShifts
        .map((shift) => shift.caregiver?.profile_id)
        .filter((id): id is string => !!id);
    }

    const where: any = {
      status: Status.APPROVED,
    };

    if (excludedCaregiverIds.length > 0) {
      where.profile_id = Not(In(excludedCaregiverIds));
    }

    return await this.caregiverRepo.find({
      where,
      relations: ['profile'],
    });
  }
}
