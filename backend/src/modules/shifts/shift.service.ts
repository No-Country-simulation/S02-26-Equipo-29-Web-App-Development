/* eslint-disable prettier/prettier */
// src/modules/shifts/shifts.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { Shift } from './shift.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { Patient } from '../patients/patient.entity';
import { Profile } from '../profiles/profile.entity';

import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftStatus } from './enums/shift-status.enum';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,

    @InjectRepository(Caregiver)
    private readonly caregiverRepository: Repository<Caregiver>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async updateStatus(id: string, dto: UpdateStatusDto): Promise<Shift> {
    const shift = await this.findOne(id);
    if (!shift) {
      throw new BadRequestException('No se encontro el turno');
    }
    if (dto.status === ShiftStatus.ASSIGNED) {
      if (!shift.caregiver) {
        throw new BadRequestException('Debes asignarle un cuidador');
      }
    }
    if (shift.status === ShiftStatus.COMPLETED) {
      throw new BadRequestException('El turno ya se encuentra completado');
    }
    shift.status = dto.status;
    return this.shiftRepository.save(shift);
  }

  async create(dto: CreateShiftDto): Promise<Shift> {
    const patient = await this.patientRepository.findOne({
      where: { profile_id: dto.patientId },
      relations: ['profile'],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const start = new Date(dto.start_time);
    const end = new Date(dto.end_time);
    const report = dto.report ? dto.report : null;
    const service = dto.service ? dto.service : null;
    const location = dto.location ? dto.location : null;

    if (end <= start) {
      throw new BadRequestException('end_time must be greater than start_time');
    }

    const alreadyExists = await this.allReadyExists(
      dto.start_time,
      dto.end_time,
      dto.patientId,
    );
    if (alreadyExists) {
      throw new BadRequestException('Shift already exists');
    }
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    const shift = this.shiftRepository.create({
      patient,
      start_time: start,
      end_time: end,
      hours,
      status: ShiftStatus.PENDING,
      service: service,
      profile: patient.profile,
      report: report,
      location: location,
    });
    console.log('Creating shift:', shift);
    return this.shiftRepository.save(shift);
  }

  async allReadyExists(
    start_time: string,
    end_time: string,
    patientId: string,
  ): Promise<boolean> {
    const start = new Date(start_time);
    const end = new Date(end_time);
    const shift = await this.shiftRepository.findOneBy({
      start_time: Between(start, end),
      end_time: Between(start, end),
      patient: {
        profile_id: patientId,
      },
    });
    return !!shift;
  }

  // 📄 FIND ALL
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.shiftRepository.findAndCount({
      relations: [
        'caregiver',
        'patient',
        'patient.profile',
        'approved_by',
        'profile',
      ],
      order: { created_at: 'DESC' },
      take: limit,
      skip: skip,
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // 🔍 FIND ONE
  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({
      where: { id },
      relations: [
        'caregiver',
        'patient',
        'patient.profile',
        'approved_by',
        'profile',
      ],
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    return shift;
  }

  // FIND MANY BY PATIENT
  async findByPatient(patientId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.shiftRepository.findAndCount({
      where: { patient: { profile_id: patientId } },
      relations: [
        'caregiver',
        'caregiver.profile',
        'patient',
        'approved_by',
        'profile',
      ],
      order: { created_at: 'DESC' },
      take: limit,
      skip: skip,
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // FIND MANY BY CAREGIVER
  async findByCaregiver(
    caregiverProfileId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.shiftRepository.findAndCount({
      where: { caregiver: { profile_id: caregiverProfileId } },
      relations: [
        'caregiver',
        'caregiver.profile',
        'patient',
        'approved_by',
        'profile',
      ],
      order: { created_at: 'DESC' },
      take: limit,
      skip: skip,
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  // ✏ UPDATE
  async update(id: string, dto: UpdateShiftDto): Promise<Shift> {
    const shift = await this.findOne(id);

    // 🔥 Si cambian fechas, recalcular horas
    if (dto.start_time !== undefined || dto.end_time !== undefined) {
      const start = dto.start_time
        ? new Date(dto.start_time)
        : shift.start_time;

      const end = dto.end_time ? new Date(dto.end_time) : shift.end_time;

      if (end <= start) {
        throw new BadRequestException(
          'end_time must be greater than start_time',
        );
      }

      shift.start_time = start;
      shift.end_time = end;

      shift.hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    // 📝 Actualizar reporte si viene
    if (dto.report !== undefined) {
      shift.report = dto.report;
    }

    if (dto.caregiverId !== undefined) {
      const caregiver = await this.caregiverRepository.findOneBy({
        profile_id: dto.caregiverId,
      });
      if (!caregiver) {
        throw new NotFoundException('Caregiver not found');
      }
      shift.caregiver = caregiver;
    }

    return this.shiftRepository.save(shift);
  }

  // 🗑 DELETE
  async remove(id: string): Promise<void> {
    const shift = await this.findOne(id);
    await this.shiftRepository.remove(shift);
  }
}
