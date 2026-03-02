import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsNotEmpty()
  @IsString()
  ids: string;

  @IsOptional()
  @IsString()
  cbu?: string;

  @IsOptional()
  @IsString()
  alias?: string;
}
