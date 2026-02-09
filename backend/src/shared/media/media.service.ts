import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  private isMulterFile(file: unknown): file is Express.Multer.File {
    return (
      typeof file === 'object' &&
      file !== null &&
      'buffer' in file &&
      Buffer.isBuffer((file as { buffer: unknown }).buffer)
    );
  }

  async uploadImage(
    file: unknown,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    if (!this.isMulterFile(file)) {
      throw new BadRequestException('Archivo inválido');
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            this.logger.error(error);
            return reject(
              new InternalServerErrorException('Cloudinary upload failed'),
            );
          }
          if (!result) {
            return reject(
              new InternalServerErrorException('No result from Cloudinary'),
            );
          }
          resolve(result);
        },
      );

      upload.end(file.buffer);
    });
  }

  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      throw new InternalServerErrorException('Cloudinary delete failed');
    }
  }
}
