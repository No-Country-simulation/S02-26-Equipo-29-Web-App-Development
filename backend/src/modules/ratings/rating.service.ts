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

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,

    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async create(dto: CreateRatingDto, profileId: string): Promise<Rating> {
    const shift = await this.shiftRepository.findOne({
      where: { id: dto.shiftId },
      relations: ['rating', 'patient', 'patient.profile'],
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    if (shift.rating) {
      throw new BadRequestException('Shift already rated');
    }
    console.log('JWT profileId:', profileId);
    console.log('Shift patient.profile_id:', shift.patient.profile_id);
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

    if (shift.status !== ShiftStatus.COMPLETED) {
      shift.status = ShiftStatus.COMPLETED;
      await this.shiftRepository.save(shift);
    }

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
