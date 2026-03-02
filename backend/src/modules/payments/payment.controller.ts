import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { ProfileRole } from '../profiles/enums/profile-role.enum';
import { PaymentService } from './payments.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(ProfileRole.ADMIN)
  @Post('/preference')
  createPreference(@Body() body: any) {
    return this.paymentService.createPreference(body);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(ProfileRole.ADMIN)
  @Post('/transfer')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'transfer_receipt', maxCount: 1 }], {
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
  async createTransfer(
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Body() body: CreateTransferDto,
  ) {
    if (
      !files ||
      !files.transfer_receipt ||
      files.transfer_receipt.length === 0
    ) {
      throw new BadRequestException('No se ha enviado el comprobante');
    }

    return this.paymentService.createTransfer(body, files.transfer_receipt[0]);
  }
}
