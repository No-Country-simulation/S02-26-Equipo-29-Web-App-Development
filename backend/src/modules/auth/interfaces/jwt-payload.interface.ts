import type { ProfileRole } from '../../profiles/enums/profile-role.enum';

export interface JwtPayload {
  sub: string;
  role: ProfileRole;
}
