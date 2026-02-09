// src/modules/family/entities/family-patient.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Profile } from '../profiles/profile.entity';
import { Patient } from '../patients/patient.entity';

@Entity('family_patients')
export class FamilyPatient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.family_links)
  profile: Profile;

  @ManyToOne(() => Patient, (patient) => patient.family_members)
  patient: Patient;

  @Column()
  relationship: string;

  @CreateDateColumn()
  created_at: Date;
}
