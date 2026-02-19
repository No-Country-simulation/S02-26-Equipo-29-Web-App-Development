/* eslint-disable prettier/prettier */
// src/modules/shifts/entities/shift.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Caregiver } from '../caregivers/caregiver.entity';
import { Patient } from '../patients/patient.entity';
import { Profile } from '../profiles/profile.entity';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Caregiver, (caregiver) => caregiver.shifts)
  caregiver: Caregiver;

  @ManyToOne(() => Patient, (patient) => patient.shifts)
  patient: Patient;

  @ManyToOne(() => Profile, (profile) => profile.approved_shifts, {
    nullable: true,
  })
  approved_by: Profile;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'numeric' })
  hours: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  report: string;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
