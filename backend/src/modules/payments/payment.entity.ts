// src/modules/payments/entities/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Payroll } from '../payrolls/payroll.entity';
import { PaymentMethod } from './enum/payment-method.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Payroll, (payroll) => payroll.payments)
  payroll: Payroll;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  transfer_receipt: string;

  @Column()
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;
}
