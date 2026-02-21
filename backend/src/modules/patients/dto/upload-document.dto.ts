/* eslint-disable prettier/prettier */
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { PatientDocumentType } from '../enums/patient-document-type.enum';

export class UploadDocumentDto {
  @IsEnum(PatientDocumentType, {
    message: 'document_type inválido',
  })
  document_type!: PatientDocumentType;

  @IsOptional()
  @IsUrl({}, { message: 'file_url debe ser una URL válida' })
  file_url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}
