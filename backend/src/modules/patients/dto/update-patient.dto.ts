import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { PatientStatus } from '../enums/patient-status-enum';

export class UpdatePatientDto {
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

  @IsOptional()
  @IsEnum(PatientStatus, { message: 'El estado no es válido' })
  status?: PatientStatus;
}
