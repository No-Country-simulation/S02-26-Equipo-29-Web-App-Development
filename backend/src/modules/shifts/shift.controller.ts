// src/modules/shifts/shifts.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { ShiftsService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProfileRole } from '../profiles/enums/profile-role.enum';
import { UpdateStatusDto } from './dto/update-status.dto';
// import { Profile } from '../profiles/profile.entity';

// interface AuthRequest extends Request {
//   user: Profile;
// }

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  // 👨‍💼 SOLO ADMIN puede crear guardias
  @Post()
  @Roles()
  create(@Body() dto: CreateShiftDto) {
    return this.shiftsService.create(dto);
  }

  // 👀 ADMIN y STAFF pueden ver todas
  @Get()
  @Roles(ProfileRole.ADMIN, ProfileRole.STAFF)
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.shiftsService.findAll(page, limit, status);
  }

  @Get(':id')
  @Roles(ProfileRole.ADMIN, ProfileRole.STAFF)
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(id);
  }

  @Get('patient/:patientId/next')
  @Roles(ProfileRole.PATIENT)
  findNext(@Param('patientId') patientId: string) {
    return this.shiftsService.findNext(patientId);
  }

  @Get('patient/:patientId')
  @Roles(
    ProfileRole.ADMIN,
    ProfileRole.STAFF,
    ProfileRole.CAREGIVER,
    ProfileRole.FAMILY,
    ProfileRole.PATIENT,
  )
  findByPatient(
    @Param('patientId') patientId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.shiftsService.findByPatient(patientId, page, limit);
  }

  @Get('caregiver/:caregiverProfileId')
  @Roles(ProfileRole.ADMIN, ProfileRole.STAFF, ProfileRole.CAREGIVER)
  findByCaregiver(
    @Param('caregiverProfileId') caregiverProfileId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.shiftsService.findByCaregiver(caregiverProfileId, page, limit);
  }

  @Patch(':id')
  @Roles(ProfileRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
    return this.shiftsService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles(ProfileRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.shiftsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @Roles(ProfileRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(id);
  }
}
