import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Caregiver } from '../caregivers/caregiver.entity';
import { Patient } from '../patients/patient.entity';
import { Profile } from '../profiles/profile.entity';
import { ShiftStatus } from './enums/shift-status.enum';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 👨‍💼 ADMIN que creó la guardia
  @ManyToOne(() => Profile, { nullable: false })
  @JoinColumn({ name: 'created_by_id' })
  created_by!: Profile;

  // 👩‍⚕️ Cuidador asignado
  @ManyToOne(() => Caregiver, (caregiver) => caregiver.shifts, {
    nullable: true,
  })
  @JoinColumn({ name: 'caregiver_id' })
  caregiver!: Caregiver | null;

  // 🧑‍🦽 Paciente
  @ManyToOne(() => Patient, (patient) => patient.shifts, {
    nullable: false,
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

  @Column({ type: 'text', nullable: true })
  report!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  approved_at!: Date | null;

  @CreateDateColumn()
  created_at!: Date;
}
