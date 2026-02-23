/* eslint-disable prettier/prettier */
import { IsUUID, IsDateString, IsString, IsOptional } from 'class-validator';
import { ShiftStatus } from '../enums/shift-status.enum';

export class CreateShiftDto {
  @IsUUID()
  @IsOptional()
  caregiverId?: string;

  @IsUUID()
  patientId!: string;

  @IsDateString()
  start_time!: string;

  @IsDateString()
  end_time!: string;

  @IsOptional()
  @IsString()
  report?: string;

  @IsOptional()
  @IsString()
  status?: ShiftStatus;

  @IsString()
  service!: string;
}
