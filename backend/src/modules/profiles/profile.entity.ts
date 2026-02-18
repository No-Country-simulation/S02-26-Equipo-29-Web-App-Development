import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { AuthUser } from '../auth/auth-user.entity';
import { Patient } from '../patients/patient.entity';
import { FamilyPatient } from '../family/family-patient.entity';
import { Shift } from '../shifts/shift.entity';
import { Caregiver } from '../caregivers/caregiver.entity';
import { ProfileRole } from './enums/profile-role.enum';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => AuthUser, (user: AuthUser) => user.profile, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: AuthUser;

  @Column()
  full_name!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: ProfileRole })
  role!: ProfileRole;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  /* Relaciones */

  @OneToMany(() => Patient, (patient: Patient) => patient.primary_contact)
  managed_patients!: Patient[];

  @OneToMany(() => FamilyPatient, (fp: FamilyPatient) => fp.profile)
  family_links!: FamilyPatient[];

  @OneToMany(() => Shift, (shift: Shift) => shift.approved_by)
  approved_shifts!: Shift[];

  @OneToOne(() => Caregiver, (caregiver: Caregiver) => caregiver.profile)
  caregiver!: Caregiver;

  @OneToOne(() => Patient, (patient: Patient) => patient.profile)
  patient!: Patient;
}
