import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthUser } from './auth-user.entity';
import { Profile } from '../profiles/profile.entity';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly authUserRepo: Repository<AuthUser>,

    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    private readonly jwtService: JwtService,
  ) {}

  // =====================
  // 🔐 Registro
  // =====================
  async register(dto: RegisterDto) {
    const exists = await this.authUserRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.authUserRepo.create({
      email: dto.email,
      password_hash: passwordHash,
    });

    await this.authUserRepo.save(user);

    const profile = this.profileRepo.create({
      user,
      full_name: dto.full_name,
      role: dto.role,
    });

    await this.profileRepo.save(profile);

    return this.buildToken(user, profile);
  }

  // =====================
  // 🔑 Login
  // =====================
  async login(dto: LoginDto) {
    const user = await this.authUserRepo.findOne({
      where: { email: dto.email },
      relations: ['profile'],
    });

    if (!user || !user.profile) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.password_hash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildToken(user, user.profile);
  }

  // =====================
  // 🎟️ JWT
  // =====================
  private buildToken(
    user: AuthUser,
    profile: Profile,
  ): { access_token: string } {
    const payload = {
      sub: user.id,
      profileId: profile.id,
      role: profile.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
