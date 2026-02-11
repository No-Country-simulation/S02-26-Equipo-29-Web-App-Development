import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthUser } from './auth-user.entity';
import { Profile, ProfileRole } from '../profiles/profile.entity';
import { Caregiver } from '../caregivers/caregiver.entity';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly authUserRepo: Repository<AuthUser>,

    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectRepository(Caregiver)
    private readonly caregiverRepo: Repository<Caregiver>,

    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
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

    return this.dataSource.transaction(async (manager) => {
      const passwordHash = await bcrypt.hash(dto.password, 10);

      // 1️⃣ Crear usuario
      const user = manager.create(AuthUser, {
        email: dto.email,
        password_hash: passwordHash,
      });

      await manager.save(user);

      // 2️⃣ Crear profile
      const profile = manager.create(Profile, {
        user,
        full_name: dto.full_name,
        role: dto.role,
      });

      await manager.save(profile);

      // 3️⃣ Si es caregiver, crear registro caregiver
      if (profile.role === ProfileRole.CAREGIVER) {
        const caregiver = manager.create(Caregiver, {
          profile_id: profile.id,
        });

        await manager.save(caregiver);
      }

      return this.buildToken(user, profile);
    });
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
