/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Caregiver } from './caregiver.entity';
import { CaregiverDocument } from './caregiver-document.entity';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { CaregiverDocumentStatus } from './enums/caregiver-document-status.enum';
import { CloudinaryService } from '../../shared/media/media.service';

@Injectable()
export class CaregiverService {
  constructor(
    @InjectRepository(Caregiver)
    private readonly caregiverRepo: Repository<Caregiver>,

    @InjectRepository(CaregiverDocument)
    private readonly documentRepo: Repository<CaregiverDocument>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return this.caregiverRepo.find({    
      relations: ['profile'],
    });
  }

  async create(caregiver: Caregiver) {
    return this.caregiverRepo.save(caregiver);
  }

  async caregiverById(profileId: string) {
    const caregiver = await this.caregiverRepo.findOne({
      where: { profile_id: profileId },
    });
    if (!caregiver) {
      throw new NotFoundException('Caregiver no encontrado');
    }
    return caregiver;
  }

  async upDateCaregiver(profileId: string, data: Partial<Caregiver>) {
    const caregiver = await this.caregiverRepo.findOne({
      where: { profile_id: profileId },
    });
    if (!caregiver) {
      throw new NotFoundException('Caregiver no encontrado');
    }
    Object.assign(caregiver, data);
    return this.caregiverRepo.save(caregiver);
  }

  async uploadDocument(
    caregiverProfileId: string,
    dto: UploadDocumentDto,
    file: unknown,
  ): Promise<CaregiverDocument> {
    // 1️⃣ Validar caregiver
    const caregiver = await this.caregiverRepo.findOne({
      where: { profile_id: caregiverProfileId },
    });

    if (!caregiver) {
      throw new NotFoundException('Caregiver no encontrado');
    }

    // 2️⃣ Evitar duplicados por tipo
    const exists = await this.documentRepo.findOne({
      where: {
        caregiver: { profile_id: caregiverProfileId },
        document_type: dto.document_type,
      },
    });

    if (exists) {
      throw new BadRequestException('El documento ya fue cargado');
    }

    // 3️⃣ Subir archivo a Cloudinary
    const upload = await this.cloudinaryService.uploadImage(file, {
      folder: `caregivers/${caregiverProfileId}`,
      resource_type: 'auto',
    });

    // 4️⃣ Crear documento
    const document = this.documentRepo.create({
      caregiver,
      document_type: dto.document_type,
      file_url: upload.secure_url,
      status: CaregiverDocumentStatus.PENDING,
    });

    // 5️⃣ Guardar
    return this.documentRepo.save(document);
  }
}
