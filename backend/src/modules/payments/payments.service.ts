import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Payment } from './payment.entity';
import { CloudinaryService } from '../../shared/media/media.service';
import { Payroll } from '../payrolls/payroll.entity';
import { PaymentMethod } from './enum/payment-method.enum';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class PaymentService {
  private readonly client: MercadoPagoConfig;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.config.get('MP_ACCESS_TOKEN')!,
    });
  }

  async createPreference(body: any) {
    console.log('createPreference', body);
    const preference = new Preference(this.client);
    const response = await preference.create(body);
    return response;
  }

  async createTransfer(body: CreateTransferDto, file: Express.Multer.File) {
    const { amount, ids } = body;
    const payrollIds = ids.split(',');

    const upload = await this.cloudinaryService.uploadImage(file, {
      folder: 'payment_receipts',
    });

    const payment = this.paymentRepository.create({
      amount: Number(amount),
      payment_method: PaymentMethod.TRANSFER,
      status: 'completed',
      transfer_receipt: upload.secure_url,
    });
    await this.paymentRepository.save(payment);

    await this.payrollRepository.update(
      { id: In(payrollIds) },
      { status: 'approved' },
    );

    return payment;
  }
}
