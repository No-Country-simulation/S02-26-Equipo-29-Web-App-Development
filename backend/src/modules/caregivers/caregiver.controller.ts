import { Controller, Get } from '@nestjs/common';
import { CaregiverService } from './caregiver.service';

@Controller('caregivers')
export class CaregiverController {
  constructor(private readonly caregiverService: CaregiverService) {}

  @Get()
  findAll() {
    return this.caregiverService.findAll();
  }
}
