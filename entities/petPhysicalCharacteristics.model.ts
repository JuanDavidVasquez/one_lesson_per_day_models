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
import { CoatType } from '../shared/enums/coatType.enum';
import { Size } from '../shared/enums/size.enum';

@Entity('pet_physical_characteristics')
export class PetPhysicalCharacteristics {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => Pet, (pet) => pet.physicalCharacteristics, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'pet_id' })
    pet!: Pet;

    // 🔹 Datos físicos básicos
    @Column({ 
        type: 'float', 
        nullable: true,
        comment: 'Peso del animal en kg'
    })
    weight!: number;

    @Column({ 
        type: 'float',
        nullable: true,
        comment: 'Altura del animal en cm'
     })
    height!: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    color!: string;

    @Column({
        type: 'enum',
        enum: CoatType,
        nullable: true,
    })
    coatType!: CoatType;

    @Column({ type: 'varchar', length: 50, nullable: true })
    eyeColor!: string;

    @Column({ type: 'enum',
        enum: Size,
        nullable: true })
    size!: Size;

    @Column({ type: 'varchar', 
        length: 100, 
        nullable: true,
        comment: 'Marcas distintivas del animal'
    })
    distinctiveMarks!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
