// src/modules/patients/entities/patient.entity.ts
import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Profile } from '../profiles/profile.entity';
import { FamilyPatient } from '../family/family-patient.entity';
import { Shift } from '../shifts/shift.entity';

@Entity('patients')
export class Patient {
  @PrimaryColumn('uuid')
  profile_id!: string;

  @ManyToOne(() => Profile, (profile) => profile.managed_patients)
  primary_contact: Profile;

  @Column({ nullable: true })
  dni: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Profile, (profile: Profile) => profile.patient)
  @JoinColumn({ name: 'profile_id' })
  profile!: Profile;

  @OneToMany(() => FamilyPatient, (fp) => fp.patient)
  family_members: FamilyPatient[];

  @OneToMany(() => Shift, (shift) => shift.patient)
  shifts: Shift[];
}
