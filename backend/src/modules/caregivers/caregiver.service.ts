import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caregiver } from './caregiver.entity';

@Injectable()
export class CaregiverService {
  constructor(
    @InjectRepository(Caregiver)
    private readonly caregiverRepo: Repository<Caregiver>,
  ) {}

  async findAll() {
    return this.caregiverRepo.find();
  }

  async create(caregiver: Caregiver) {
    return this.caregiverRepo.save(caregiver);
  }
}
