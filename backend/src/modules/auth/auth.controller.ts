/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { JwtPayload } from './jwt.strategy';
import { ProfilesService } from '../profiles/profile.service';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: RequestWithUser) {
    const { sub } = req.user;
    const profile = await this.profilesService.findById(sub);

    if (!profile) {
      return null;
    }
    return {
      id: profile.id,
      full_name: profile.full_name,
      email: profile.user.email,
      role: profile.role,
      phone: profile.phone,
      is_active: profile.is_active,
      created_at: profile.created_at,
    };
  }
}
