import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pet } from './pet.model';


@Entity('species')
export class Species {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  name!: string; // perro, gato, conejo, etc.

  @OneToMany(() => Pet, (pet) => pet.species)
  pets!: Pet[];
}
