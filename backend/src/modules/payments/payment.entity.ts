// src/modules/payments/entities/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Payroll } from '../payrolls/payroll.entity';
import { PaymentMethod } from './enum/payment-method.enum';
import { PaymentStatus } from './enum/payment-status.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Payroll, (payroll) => payroll.payment)
  payrolls: Payroll[];

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  transfer_receipt: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;
}
