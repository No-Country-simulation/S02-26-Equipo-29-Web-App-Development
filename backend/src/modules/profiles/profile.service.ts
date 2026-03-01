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
}
