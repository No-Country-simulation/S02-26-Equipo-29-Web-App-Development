/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  Req,
  UseGuards,
  Delete,
  UploadedFiles,
  Put,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { CaregiverService } from './caregiver.service';
import type { AuthRequest } from '../../common/interfaces/auth-request.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Caregiver } from './caregiver.entity';

@Controller('caregivers')
export class CaregiverController {
  constructor(private readonly caregiverService: CaregiverService) {}
  

  @Delete('documents/:id')
  @UseGuards(JwtAuthGuard)
  deleteDocument(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.caregiverService.deleteDocument(id, req.user.profileId);
  }
  @Get()
  findAll() {
    return this.caregiverService.findAll();
  }

  @Get('my_documents')
  @UseGuards(JwtAuthGuard)
  getDocuments(@Req() req: AuthRequest) {
    return this.caregiverService.getDocuments(req.user.profileId);
  }

  @Get(':caregiverId')
  caregiverByIdParam(@Param('caregiverId') caregiverId: string) {
    return this.caregiverService.caregiverById(caregiverId);
  }

 

  @Put(":caregiverId")
  @UseGuards(JwtAuthGuard)
  updateCaregiver(@Param('caregiverId') caregiverId: string, @Body() data: Partial<Caregiver>) {
    return this.caregiverService.upDateCaregiver(caregiverId, data);
  }

  @Post('documents')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'dni_front', maxCount: 1 },
        { name: 'dni_back', maxCount: 1 },
        { name: 'criminal_record', maxCount: 1 },
      ],
      {
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
      },
    ),
  )
  uploadDocuments(
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Req() req: AuthRequest,
  ) {
    if (!files || Object.keys(files).length === 0) {
      throw new BadRequestException('No se han enviado archivos');
    }

    return this.caregiverService.uploadMultipleDocuments(req.user.profileId, files);
  }
}
