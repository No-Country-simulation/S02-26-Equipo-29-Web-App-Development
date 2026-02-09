import type { ProfileRole } from '../../profiles/profile.entity';

export class RegisterDto {
  email!: string;
  password!: string;
  full_name!: string;
  role!: ProfileRole;
}
