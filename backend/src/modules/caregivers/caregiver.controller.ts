import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { CaregiverService } from './caregiver.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import type { AuthRequest } from '../../common/interfaces/auth-request.interface';

@Controller('caregivers')
export class CaregiverController {
  constructor(private readonly caregiverService: CaregiverService) {}

  @Get()
  findAll() {
    return this.caregiverService.findAll();
  }

  @Post('documents')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5_000_000 },
      fileFilter: (_, file, cb) => {
        if (
          !file.mimetype.includes('pdf') &&
          !file.mimetype.includes('image')
        ) {
          return cb(new BadRequestException('Formato no permitido'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @Req() req: AuthRequest,
  ) {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    return this.caregiverService.uploadDocument(req.user.profile_id, dto, file);
  }
}
