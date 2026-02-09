import { Module } from '@nestjs/common';
import { CloudinaryService } from './media.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class MediaModule {}
