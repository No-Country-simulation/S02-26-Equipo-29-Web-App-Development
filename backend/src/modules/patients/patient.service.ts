/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { Repository } from 'typeorm';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientDocument } from './patient-document.entity';
import { CloudinaryService } from '../../shared/media/media.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { PatientDocumentStatus } from './enums/patient-document-status.enum';
import { PatientDocumentType } from './enums/patient-document-type.enum';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,

    @InjectRepository(PatientDocument)
    private readonly documentRepo: Repository<PatientDocument>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return this.patientRepo.find();
  }

  async findOne(id: string) {
    const patient = await this.patientRepo.findOne({
      where: { profile_id: id },
      relations: ['profile'],
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
      updateData,
    );

    console.log('🔍 Resultado de la actualización:', result);

    // Retornar el paciente actualizado
    const updatedPatient = await this.findOne(id);
    console.log('🔍 Paciente después de actualizar:', updatedPatient);

    return updatedPatient;
  }

  async getDocuments(profileId: string) {
    return this.documentRepo.find({
      where: { patient: { profile_id: profileId } },
    });
  }

  async uploadDocument(
    patientProfileId: string,
    dto: UploadDocumentDto,
    file: Express.Multer.File,
  ): Promise<PatientDocument> {
    const patient = await this.patientRepo.findOne({
      where: { profile_id: patientProfileId },
    });

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const exists = await this.documentRepo.findOne({
      where: {
        patient: { profile_id: patientProfileId },
        document_type: dto.document_type,
      },
    });

    if (exists) {
      throw new BadRequestException('El documento ya fue cargado');
    }

    const upload = await this.cloudinaryService.uploadImage(file, {
      folder: `patients/${patientProfileId}`,
      resource_type: 'auto',
    });

    const document = this.documentRepo.create({
      patient,
      document_type: dto.document_type,
      file_url: upload.secure_url,
      status: PatientDocumentStatus.PENDING,
    });

    return this.documentRepo.save(document);
  }

  async uploadMultipleDocuments(
    patientProfileId: string,
    files: { [key: string]: Express.Multer.File[] },
  ) {
    const results: PatientDocument[] = [];
    for (const [type, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0];
        const dto = new UploadDocumentDto();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dto.document_type = type as PatientDocumentType;
        results.push(await this.uploadDocument(patientProfileId, dto, file));
      }
    }
    return results;
  }

  async deleteDocument(id: string, patientProfileId: string) {
    const document = await this.documentRepo.findOne({
      where: { id, patient: { profile_id: patientProfileId } },
    });
    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }
    await this.cloudinaryService.delete(document.file_url);
    return this.documentRepo.remove(document);
  }
}
