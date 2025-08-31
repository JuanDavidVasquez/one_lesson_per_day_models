import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Species } from './species.model';
import { Pet } from './pet.model';


@Entity('breeds')
export class Breed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string; // Labrador, Siamés, etc.

  @ManyToOne(() => Species, (species) => species.id, { eager: true })
  @JoinColumn({ name: 'species_id' })
  species!: Species;

  @OneToMany(() => Pet, (pet) => pet.breed)
  pets!: Pet[];
}
