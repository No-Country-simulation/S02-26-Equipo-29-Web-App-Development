// src/modules/patients/entities/patient.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from '../profiles/profile.entity';
import { FamilyPatient } from '../family/family-patient.entity';
import { Shift } from '../shifts/shift.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile, (profile) => profile.managed_patients)
  primary_contact: Profile;

  @Column()
  full_name: string;

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

  @OneToMany(() => FamilyPatient, (fp) => fp.patient)
  family_members: FamilyPatient[];

  @OneToMany(() => Shift, (shift) => shift.patient)
  shifts: Shift[];
}
