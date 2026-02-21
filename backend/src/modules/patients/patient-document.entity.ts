/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity('patient_documents')
export class PatientDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.documents)
  patient: Patient;

  @Column()
  document_type: string;

  @Column()
  file_url: string;

  @Column()
  status: string;

  @CreateDateColumn()
  uploaded_at: Date;
}
