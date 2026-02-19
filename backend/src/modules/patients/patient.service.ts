/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { Repository } from 'typeorm';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async findAll() {
    return this.patientRepo.find();
  }

  async findOne(id: string) {
    const patient = await this.patientRepo.findOne({ 
      where: { profile_id: id },
      relations: ['profile']
    });
    
    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    
    return patient;
  }

  async create(patientData: CreatePatientDto) {
    const patient = this.patientRepo.create(patientData);
    return this.patientRepo.save(patient);
  }

  async update(id: string, updateData: UpdatePatientDto) {
    // Log para debugging
    console.log('🔍 Datos recibidos para actualizar:', updateData);
    console.log('🔍 ID del paciente:', id);
    
    // Verificar que el paciente existe
    const patient = await this.findOne(id);
    console.log('🔍 Paciente antes de actualizar:', patient);
    
    // Actualizar usando el método update de TypeORM
    const result = await this.patientRepo.update(
      { profile_id: id },
      updateData
    );
    
    console.log('🔍 Resultado de la actualización:', result);
    
    // Retornar el paciente actualizado
    const updatedPatient = await this.findOne(id);
    console.log('🔍 Paciente después de actualizar:', updatedPatient);
    
    return updatedPatient;
  }
}
