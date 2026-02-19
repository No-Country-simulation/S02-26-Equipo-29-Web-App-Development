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
  Request,
  Req,
} from '@nestjs/common';

import { ShiftsService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProfileRole } from '../profiles/enums/profile-role.enum';
import { Profile } from '../profiles/profile.entity';

interface AuthRequest extends Request {
  user: Profile;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  // 👨‍💼 SOLO ADMIN puede crear guardias
  @Post()
  @Roles(ProfileRole.ADMIN)
  create(@Body() dto: CreateShiftDto, @Req() req: AuthRequest) {
    return this.shiftsService.create(dto, req.user);
  }

  // 👀 ADMIN y STAFF pueden ver todas
  @Get()
  @Roles(ProfileRole.ADMIN, ProfileRole.STAFF)
  findAll() {
    return this.shiftsService.findAll();
  }

  @Get(':id')
  @Roles(ProfileRole.ADMIN, ProfileRole.STAFF)
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(id);
  }

  @Patch(':id')
  @Roles(ProfileRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
    return this.shiftsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(ProfileRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(id);
  }
}
