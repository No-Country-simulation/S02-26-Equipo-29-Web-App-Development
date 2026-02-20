/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'El ID del perfil es requerido' })
  @IsUUID('4', { message: 'El ID del perfil debe ser un UUID válido' })
  profile_id!: string;

  @IsOptional()
  @IsUUID('4', {
    message: 'El ID del contacto primario debe ser un UUID válido',
  })
  primary_contact_id?: string;

  @IsOptional()
  @IsString({ message: 'El DNI debe ser una cadena de texto' })
  dni?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser válida' })
  birth_date?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Las notas deben ser una cadena de texto' })
  notes?: string;
}
