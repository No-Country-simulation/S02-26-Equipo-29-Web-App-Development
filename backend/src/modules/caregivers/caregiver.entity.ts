// src/modules/caregivers/entities/caregiver.entity.ts
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { CaregiverDocument } from './caregiver-document.entity';
import { Shift } from '../shifts/shift.entity';
import { Payroll } from '../payrolls/payroll.entity';

@Entity('caregivers')
export class Caregiver {
  @PrimaryColumn('uuid')
  profile_id!: string;

  @Column({ nullable: true })
  cbu?: string;

  @Column({ nullable: true })
  mercado_pago_alias?: string;

  @Column({ type: 'numeric', nullable: true })
  hourly_rate?: number;

  @Column({ default: false })
  is_verified!: boolean;

  @OneToMany(() => CaregiverDocument, (doc: any) => doc.caregiver)
  documents!: CaregiverDocument[];

  @OneToMany(() => Shift, (shift: Shift) => shift.caregiver)
  shifts!: Shift[];

  @OneToMany(() => Payroll, (payroll: Payroll) => payroll.caregiver)
  payrolls!: Payroll[];
}
