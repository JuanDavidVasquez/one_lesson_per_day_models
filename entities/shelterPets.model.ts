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
import { Shelter } from './shelter.model';
import { StatusPetShelter } from '../shared/enums/statusPetShelter.enum';

@Entity('shelter_pets')
export class ShelterPet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Shelter, (shelter) => shelter.shelterPets)
  @JoinColumn({ name: 'shelter_id' })
  shelter!: Shelter;

  @ManyToOne(() => Pet, (pet) => pet.shelterPets, { eager: true })
  @JoinColumn({ name: 'pet_id' })
  pet!: Pet;

  @Column({ type: 'date' })
  arrivalDate!: Date;

  @Column({ type: 'date', nullable: true })
  departureDate!: Date;

  @Column({
    type: 'enum',
    enum: StatusPetShelter,
    default: StatusPetShelter.AVAILABLE,
  })
  status!: StatusPetShelter;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Observaciones (ej: llegó en mal estado, tratamiento médico, etc.)',
  })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}