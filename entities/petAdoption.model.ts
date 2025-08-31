import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from './pet.model';

@Entity('pet_adoptions')
export class PetAdoption {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Pet, (pet) => pet.adoption, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet!: Pet;

  @Column({
    type: 'enum',
    enum: ['disponible', 'en proceso', 'adoptado', 'no disponible'],
    default: 'disponible',
  })
  status!: 'disponible' | 'en proceso' | 'adoptado' | 'no disponible';

  @Column({ default: false })
  adoptionReady!: boolean;

  @Column({ type: 'text', nullable: true })
  adoptionNotes!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
