import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ProfileRole } from '../../profiles/enums/profile-role.enum';

export class RegisterDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsString({ message: 'El nombre completo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  full_name!: string;

  @IsNotEmpty({ message: 'El rol es requerido' })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    return value.toUpperCase();
  })
  @IsEnum(ProfileRole, {
    message:
      'El rol debe ser uno de los siguientes: admin, caregiver, patient, family, staff',
  })
  role!: ProfileRole;
}
