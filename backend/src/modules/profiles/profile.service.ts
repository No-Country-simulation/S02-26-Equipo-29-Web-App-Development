/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  findById(id: string) {
    return this.profileRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  findByUserId(userId: string) {
    return this.profileRepo.findOne({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
  }

  findReport(from: Date, to: Date) {
    return this.profileRepo
      .createQueryBuilder('profile')
      .leftJoin('profile.user', 'user')
      .where('profile.created_at >= :from', { from })
      .andWhere('profile.created_at <= :to', { to })
      .andWhere('profile.role IN (:...roles)', { roles: ['PATIENT', 'CAREGIVER'] })
      .select('profile.full_name', 'full_name')
      .addSelect('profile.role', 'role')
      .addSelect('user.email', 'email')
      .addSelect('profile.created_at', 'created_at')
      .getRawMany();
  }
}
