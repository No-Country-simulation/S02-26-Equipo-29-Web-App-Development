import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Status } from '../enums/caregiver-status.enum';

export class UpdateCaregiverDto {
  @IsOptional()
  @IsString({ message: 'El nombre completo debe ser una cadena de texto' })
  full_name?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'El CBU debe ser una cadena de texto' })
  cbu?: string;

  @IsOptional()
  @IsString({ message: 'El alias de Mercado Pago debe ser una cadena de texto' })
  mercado_pago_alias?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La tarifa por hora debe ser un número' })
  hourly_rate?: number;

  @IsOptional()
  @IsEnum(Status, { message: 'El estado no es válido' })
  status?: Status;
}
