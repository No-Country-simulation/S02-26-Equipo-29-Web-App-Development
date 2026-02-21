/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PatientService } from './patient.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import type { AuthRequest } from '../../common/interfaces/auth-request.interface';
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Get('my_documents')
  getDocuments(@Req() req: AuthRequest) {
    return this.patientService.getDocuments(req.user.profileId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Post()
  create(@Body() patientData: CreatePatientDto) {
    return this.patientService.create(patientData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: UpdatePatientDto) {
    return this.patientService.update(id, updateData);
  }

  @Delete('documents/:id')
  deleteDocument(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.patientService.deleteDocument(id, req.user.profileId);
  }

  @Post('documents')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'dni_front', maxCount: 1 },
        { name: 'dni_back', maxCount: 1 },
        { name: 'medical_history', maxCount: 1 },
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

    return this.patientService.uploadMultipleDocuments(req.user.profileId, files);
  }
}
