import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ShelterPet } from "./shelterPets.model";


@Entity('shelters')
export class Shelter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 250 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  address!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string;

  @Column({ type: 'text', nullable: true })
  email!: string;

  @Column({ type: 'text', nullable: true })
  website!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @OneToMany(() => ShelterPet, (shelterPet) => shelterPet.shelter)
  shelterPets!: ShelterPet[];
}
