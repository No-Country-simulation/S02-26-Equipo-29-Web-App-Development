// src/modules/shifts/shifts.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Shift } from './shift.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { Patient } from '../patients/patient.entity';
import { Profile } from '../profiles/profile.entity';

import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftStatus } from './enums/shift-status.enum';

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

  // 🔥 CREATE (solo ADMIN)
  async create(dto: CreateShiftDto, adminPayload: Profile): Promise<Shift> {
    // 🔥 Buscar el Profile real en DB
    const admin = await this.profileRepository.findOneBy({
      id: adminPayload.id,
    });

    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }

    const caregiver = await this.caregiverRepository.findOneBy({
      profile_id: dto.caregiverId,
    });

    if (!caregiver) {
      throw new NotFoundException('Caregiver not found');
    }

    const patient = await this.patientRepository.findOneBy({
      profile_id: dto.patientId,
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const start = new Date(dto.start_time);
    const end = new Date(dto.end_time);

    if (end <= start) {
      throw new BadRequestException('end_time must be greater than start_time');
    }

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    const shift = this.shiftRepository.create({
      caregiver,
      patient,
      created_by: admin, // 🔥 ahora sí es entidad real
      start_time: start,
      end_time: end,
      hours,
      status: ShiftStatus.ASSIGNED,
    });

    return this.shiftRepository.save(shift);
  }

  // 📄 FIND ALL
  async findAll(): Promise<Shift[]> {
    return this.shiftRepository.find({
      relations: ['caregiver', 'patient', 'created_by', 'approved_by'],
      order: { created_at: 'DESC' },
    });
  }

  // 🔍 FIND ONE
  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({
      where: { id },
      relations: ['caregiver', 'patient', 'created_by', 'approved_by'],
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    return shift;
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

    return this.shiftRepository.save(shift);
  }

  // 🗑 DELETE
  async remove(id: string): Promise<void> {
    const shift = await this.findOne(id);
    await this.shiftRepository.remove(shift);
  }
}
