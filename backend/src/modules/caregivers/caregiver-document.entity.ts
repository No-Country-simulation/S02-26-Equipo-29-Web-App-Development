import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Caregiver } from './caregiver.entity';

@Entity('caregiver_documents')
export class CaregiverDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Caregiver, (caregiver) => caregiver.documents)
  caregiver: Caregiver;

  @Column()
  document_type: string;

  @Column()
  file_url: string;

  @Column()
  status: string;

  @CreateDateColumn()
  uploaded_at: Date;
}
