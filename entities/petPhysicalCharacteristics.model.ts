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

@Entity('pet_physical_characteristics')
export class PetPhysicalCharacteristics {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Pet, (pet) => pet.physicalCharacteristics, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'pet_id' })
    pet!: Pet;

    // 🔹 Datos físicos básicos
    @Column({ type: 'float', nullable: true })
    weight!: number; // kg

    @Column({ type: 'float', nullable: true })
    height!: number; // cm

    @Column({ type: 'varchar', length: 50, nullable: true })
    color!: string;

    @Column({
        type: 'enum',
        enum: ['corto', 'medio', 'largo', 'sin pelo'],
        nullable: true,
    })
    coatType!: 'corto' | 'medio' | 'largo' | 'sin pelo';

    @Column({ type: 'varchar', length: 50, nullable: true })
    eyeColor!: string;

    @Column({ type: 'enum', enum: ['small', 'medium', 'large'], nullable: true })
    size!: 'small' | 'medium' | 'large';

    @Column({ type: 'varchar', length: 100, nullable: true })
    distinctiveMarks!: string; // Ej. cicatriz, mancha blanca, etc.

    // 🔹 Control de creación/actualización
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
