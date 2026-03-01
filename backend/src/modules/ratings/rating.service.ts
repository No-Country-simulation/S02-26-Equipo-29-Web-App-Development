// src/modules/ratings/ratings.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rating } from './rating.entity';
import { Shift } from '../shifts/shift.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ShiftStatus } from '../shifts/enums/shift-status.enum';
import { Payroll } from '../payrolls/payroll.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,

    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,

    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,
  ) {}

  async create(dto: CreateRatingDto, profileId: string) {
    const shift = await this.shiftRepository.findOne({
      where: { id: dto.shiftId },
      relations: [
        'rating',
        'patient',
        'patient.profile',
        'caregiver',
        'caregiver.profile',
      ],
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    if (shift.rating) {
      throw new BadRequestException('Shift already rated');
    }

    // 🔥 Validación de ownership
    if (shift.patient.profile.id !== profileId) {
      throw new ForbiddenException('You are not allowed to rate this shift');
    }

    if (
      shift.status === ShiftStatus.CANCELLED ||
      shift.status === ShiftStatus.REJECTED
    ) {
      throw new BadRequestException(
        'You cannot rate a cancelled or rejected shift',
      );
    }

    console.log(shift);

    if (shift.status !== ShiftStatus.COMPLETED) {
      shift.status = ShiftStatus.COMPLETED;
      await this.shiftRepository.save(shift);
    }

    if (!shift.caregiver) {
      throw new BadRequestException(
        'Cannot create payroll for shift without caregiver',
      );
    }

    const hourlyRate = shift.caregiver.hourly_rate || 0;

    const payroll = this.payrollRepository.create({
      caregiver: shift.caregiver,
      period_start: shift.start_time,
      period_end: shift.end_time,
      shift: shift,
      hourly_rate: hourlyRate,
      total_hours: shift.hours,
      total_amount: shift.hours * hourlyRate,
      status: 'pending',
    });
    await this.payrollRepository.save(payroll);
    const rating = this.ratingRepository.create({
      number: dto.number,
      notes: dto.notes,
      shift,
    });

    return await this.ratingRepository.save(rating);
  }
  async findByShift(shiftId: string): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: { shift: { id: shiftId } },
      relations: ['shift'],
    });
  }
}
