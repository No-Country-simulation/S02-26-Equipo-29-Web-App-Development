// src/modules/profiles/entities/profile.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuthUser } from '../users/auth-user.entity';
import { Patient } from '../patients/patient.entity';
import { FamilyPatient } from '../family/family-patient.entity';
import { Shift } from '../shifts/shift.entity';

export enum ProfileRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  FAMILY = 'FAMILY',
  CAREGIVER = 'CAREGIVER',
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => AuthUser, (user) => user.profile, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: AuthUser;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: ProfileRole })
  role: ProfileRole;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  /* Relaciones */

  @OneToMany(() => Patient, (patient) => patient.primary_contact)
  managed_patients: Patient[];

  @OneToMany(() => FamilyPatient, (fp) => fp.profile)
  family_links: FamilyPatient[];

  @OneToMany(() => Shift, (shift) => shift.approved_by)
  approved_shifts: Shift[];
}
