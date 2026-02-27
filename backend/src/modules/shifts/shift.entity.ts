import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Caregiver } from '../caregivers/caregiver.entity';
import { Patient } from '../patients/patient.entity';
import { Profile } from '../profiles/profile.entity';
import { ShiftStatus } from './enums/shift-status.enum';
import { Rating } from '../ratings/rating.entity';
import { Payroll } from '../payrolls/payroll.entity';
@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // // 👨‍💼 ADMIN que creó la guardia
  // @ManyToOne(() => Profile, { nullable: false })
  // @JoinColumn({ name: 'created_by_id' })
  // created_by!: Profile;
  // ⭐ Rating de la guardia
  @OneToOne(() => Rating, (rating) => rating.shift)
  rating!: Rating | null;

  @OneToMany(() => Payroll, (payroll) => payroll.shift)
  payrolls: Payroll[];

  // 👩‍⚕️ Cuidador asignado
  @ManyToOne(() => Caregiver, (caregiver) => caregiver.shifts, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'caregiver_id' })
  caregiver!: Caregiver | null;

  // 🧑‍🦽 Paciente
  @ManyToOne(() => Patient, (patient) => patient.shifts, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  // 👨‍💼 ADMIN que aprueba
  @ManyToOne(() => Profile, { nullable: true })
  @JoinColumn({ name: 'approved_by_id' })
  approved_by!: Profile | null;

  @Column({ type: 'timestamp' })
  start_time!: Date;

  @Column({ type: 'timestamp' })
  end_time!: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hours!: number;

  @Column({
    type: 'enum',
    enum: ShiftStatus,
    default: ShiftStatus.PENDING,
  })
  status!: ShiftStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  service!: string | null;

  @Column({ type: 'text', nullable: true })
  report!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  approved_at!: Date | null;

  @CreateDateColumn()
  created_at!: Date;
}
