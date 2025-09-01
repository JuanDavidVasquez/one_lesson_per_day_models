import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { Species } from './species.model';
import { Breed } from './breeds.model';
import { PetAdoption } from './petAdoption.model';
import { PetMedicalRecord } from './petMedicalRecord.model';
import { PetPhysicalCharacteristics } from './petPhysicalCharacteristics.model';
import { ShelterPet } from './shelterPets.model';

@Entity('pets')
export class Pet {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ type: 'date', nullable: true })
    intakeDate!: Date;

    @Column({ type: 'enum', enum: ['macho', 'hembra'] })
    sex!: 'macho' | 'hembra';

    @Column({ type: 'date', nullable: true })
    birthDate!: Date;

    @Column({ type: 'int', nullable: true })
    estimatedAge!: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    photoUrl!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    // Relaciones
    @OneToOne(() => PetAdoption, (adoption) => adoption.pet)
    adoption!: PetAdoption;

    @OneToMany(() => PetMedicalRecord, (record) => record.pet)
    medicalRecords!: PetMedicalRecord[];

    @OneToOne(() => PetPhysicalCharacteristics, (pc) => pc.pet)
    physicalCharacteristics!: PetPhysicalCharacteristics;

    @ManyToOne(() => Species, (species) => species.pets, { eager: true })
    @JoinColumn({ name: 'species_id' })
    species!: Species;

    @ManyToOne(() => Breed, (breed) => breed.pets, { eager: true })
    @JoinColumn({ name: 'breed_id' })
    breed!: Breed;

    @OneToMany(() => ShelterPet, (shelterPet) => shelterPet.pet)
    shelterPets!: ShelterPet[];
}