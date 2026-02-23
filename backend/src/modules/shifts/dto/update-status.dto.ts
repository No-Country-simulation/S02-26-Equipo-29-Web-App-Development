import { ShiftStatus } from '../enums/shift-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(ShiftStatus)
  @IsNotEmpty()
  status: ShiftStatus;
}
