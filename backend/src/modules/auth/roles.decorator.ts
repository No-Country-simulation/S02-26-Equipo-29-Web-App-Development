import { SetMetadata } from '@nestjs/common';
import type { ProfileRole } from '../profiles/enums/profile-role.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: ProfileRole[]) => SetMetadata(ROLES_KEY, roles);
