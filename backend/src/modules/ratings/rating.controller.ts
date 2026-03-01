import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { RatingsService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './rating.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ProfileRole } from '../profiles/enums/profile-role.enum';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  // ⭐ Solo PATIENT puede crear rating
  @Roles(ProfileRole.PATIENT)
  @Post()
  async create(
    @Body() dto: CreateRatingDto,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<Rating | null> {
    const user = req.user;
    return this.ratingsService.create(dto, user.sub);
  }

  // 🔎 Obtener rating por shift
  @Get(':shiftId')
  async findByShift(
    @Param('shiftId', new ParseUUIDPipe()) shiftId: string,
  ): Promise<Rating | null> {
    return this.ratingsService.findByShift(shiftId);
  }
}
