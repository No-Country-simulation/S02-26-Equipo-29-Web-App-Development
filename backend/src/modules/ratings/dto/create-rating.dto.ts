import { IsUUID, IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  @IsUUID()
  shiftId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  number: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
