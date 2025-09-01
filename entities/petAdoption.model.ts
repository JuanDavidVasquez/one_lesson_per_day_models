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
import { StatusAdoption } from '../shared/enums/statusAdoption.enum';

@Entity('pet_adoptions')
export class PetAdoption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Pet, (pet) => pet.adoption, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet!: Pet;

  @Column({
    type: 'enum',
    enum: StatusAdoption,
    default: StatusAdoption.AVAILABLE,
  })
  status!: StatusAdoption;

  @Column({ default: false })
  adoptionReady!: boolean;

  @Column({ type: 'text', nullable: true })
  adoptionNotes!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
