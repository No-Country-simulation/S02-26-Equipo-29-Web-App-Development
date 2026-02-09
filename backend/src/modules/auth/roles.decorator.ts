import { SetMetadata } from '@nestjs/common';
import type { ProfileRole } from '../profiles/profile.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: ProfileRole[]) => SetMetadata(ROLES_KEY, roles);
