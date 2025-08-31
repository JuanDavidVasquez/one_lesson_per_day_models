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

@Entity('pets')
export class Pet {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ unique: true, nullable: true, length: 50 })
    code!: string; // Código interno del refugio

    @Column({ type: 'date', nullable: true })
    intakeDate!: Date; // fecha de ingreso

    // 🔹 Datos básicos
    @Column({ type: 'enum', enum: ['macho', 'hembra'] })
    sex!: 'macho' | 'hembra';

    @Column({ type: 'date', nullable: true })
    birthDate!: Date;

    @Column({ type: 'int', nullable: true })
    estimatedAge!: number;

    // 🔹 Multimedia
    @Column({ type: 'varchar', length: 255, nullable: true })
    photoUrl!: string;

    // 🔹 Fechas
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;

    // 🔹 Relación
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


}
