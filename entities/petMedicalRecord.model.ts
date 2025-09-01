import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from './pet.model';
import { HealthStatus } from '../shared/enums/healthStatus.enum';

@Entity('pet_medical_records')
export class PetMedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pet, (pet) => pet.medicalRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet!: Pet;

  // 🔹 Estado médico
  @Column({ default: false })
  sterilized!: boolean;

  @Column({ default: false })
  vaccinated!: boolean;

  @Column({ 
    default: false,
    comment: 'Indica si el animal ha sido desparasitado interna o externamente'
  })
  dewormed!: boolean;

  @Column({ default: false })
  microchipped!: boolean;

  @Column({
    type: 'enum',
    enum: HealthStatus,
    default: HealthStatus.HEALTHY,
  })
  healthStatus!: HealthStatus;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  // 🔹 Fechas de control
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
