import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { CaregiverDocument } from './caregiver-document.entity';
import { Shift } from '../shifts/shift.entity';
import { Payroll } from '../payrolls/payroll.entity';
import { Profile } from '../profiles/profile.entity';
import { Status } from './enums/caregiver-status.enum';

@Entity('caregivers')
export class Caregiver {
  @PrimaryColumn('uuid')
  profile_id!: string;

  @OneToOne(() => Profile, (profile: Profile) => profile.caregiver, {
    eager: true,
  })
  @JoinColumn({ name: 'profile_id' })
  profile!: Profile;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  cbu?: string;

  @Column({ nullable: true })
  mercado_pago_alias?: string;

  @Column({ type: 'numeric', nullable: true })
  hourly_rate?: number;

  @Column({ default: false })
  is_verified!: boolean;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status!: Status;

  @OneToMany(() => CaregiverDocument, (doc: any) => doc.caregiver)
  documents!: CaregiverDocument[];

  @OneToMany(() => Shift, (shift: Shift) => shift.caregiver)
  shifts!: Shift[];

  @OneToMany(() => Payroll, (payroll: Payroll) => payroll.caregiver)
  payrolls!: Payroll[];

  @CreateDateColumn()
  created_at: Date;
}
