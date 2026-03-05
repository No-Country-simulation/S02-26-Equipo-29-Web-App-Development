/* eslint-disable prettier/prettier */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProfileRole } from './enums/profile-role.enum';

@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('report')
  @Roles(ProfileRole.ADMIN)
  findReport(@Query('from') from: string, @Query('to') to: string) {
    return this.profilesService.findReport(new Date(from), new Date(to));
  }
}
