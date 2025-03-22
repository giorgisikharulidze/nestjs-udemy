import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PropertyType } from "./property.model";
import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/users/user.entity";

@Entity()
export class Property{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    name: string;

    @Column({
        type: 'enum',
        enum: PropertyType
    })
    type: PropertyType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    userId: string;

    @ManyToOne(()=> User, user => user.properties )
    user: User;

}