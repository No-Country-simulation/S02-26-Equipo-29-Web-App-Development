import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Payment } from './payment.entity';
import { CloudinaryService } from '../../shared/media/media.service';
import { Payroll } from '../payrolls/payroll.entity';
import { PaymentMethod } from './enum/payment-method.enum';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { PaymentStatus } from './enum/payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createTransfer(body: CreateTransferDto, file: Express.Multer.File) {
    const { amount, ids } = body;
    const payrollIds = ids.split(',');

    const upload = await this.cloudinaryService.uploadImage(file, {
      folder: 'payment_receipts',
    });

    const payment = this.paymentRepository.create({
      amount: Number(amount),
      payment_method: PaymentMethod.TRANSFER,
      status: PaymentStatus.PAYED,
      transfer_receipt: upload.secure_url,
      paid_at: new Date(),
    });
    await this.paymentRepository.save(payment);

    await this.payrollRepository.update(
      { id: In(payrollIds) },
      {
        status: 'payed',
        payment: payment,
      },
    );

    return payment;
  }
}
