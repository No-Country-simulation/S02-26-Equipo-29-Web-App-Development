/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Patch, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  findAll() {
    return this.patientService.findAll();
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
}
