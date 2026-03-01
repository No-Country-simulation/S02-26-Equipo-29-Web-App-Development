import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreatePayrollDto {
  @IsDate()
  period_start: Date;

  @IsDate()
  period_end: Date;

  @IsNumber()
  hourly_rate: number;

  @IsNumber()
  total_hours: number;

  @IsNumber()
  total_amount: number;

  @IsString()
  status: string;
}
