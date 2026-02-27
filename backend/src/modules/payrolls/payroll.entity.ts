// src/modules/payrolls/entities/payroll.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Caregiver } from '../caregivers/caregiver.entity';
import { Payment } from '../payments/payment.entity';
import { Shift } from '../shifts/shift.entity';

@Entity('payrolls')
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Caregiver, (caregiver) => caregiver.payrolls)
  caregiver: Caregiver;

  @ManyToOne(() => Shift, (shift) => shift.payrolls)
  shift: Shift;

  @Column({ type: 'date' })
  period_start: Date;

  @Column({ type: 'date' })
  period_end: Date;

  @Column({ type: 'numeric' })
  hourly_rate: number;

  @Column({ type: 'numeric' })
  total_hours: number;

  @Column({ type: 'numeric' })
  total_amount: number;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Payment, (payment) => payment.payroll)
  payments: Payment[];
}
