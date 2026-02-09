// src/modules/payments/entities/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Payroll } from '../payrolls/payroll.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Payroll, (payroll) => payroll.payments)
  payroll: Payroll;

  @Column()
  payment_method: string;

  @Column({ nullable: true })
  external_reference: string;

  @Column()
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;
}
