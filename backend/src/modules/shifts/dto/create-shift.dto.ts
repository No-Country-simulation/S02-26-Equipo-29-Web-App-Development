import { IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateShiftDto {
  @IsUUID()
  caregiverId!: string;

  @IsUUID()
  patientId!: string;

  @IsDateString()
  start_time!: string;

  @IsDateString()
  end_time!: string;

  @IsOptional()
  @IsString()
  report?: string;
}
