/* eslint-disable prettier/prettier */
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { CaregiverDocumentType } from '../enums/caregiver-document-type.enum';

export class UploadDocumentDto {
  @IsEnum(CaregiverDocumentType, {
    message: 'document_type inválido',
  })
  document_type!: CaregiverDocumentType;

  @IsOptional()
  @IsUrl({}, { message: 'file_url debe ser una URL válida' })
  file_url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}
