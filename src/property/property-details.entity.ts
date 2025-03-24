import { IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from './property.entity';

@Entity()
export class PropertyDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @IsOptional()
  make?: string;

  @Column({ nullable: true })
  @IsOptional()
  model?: string;

  @Column({ nullable: true })
  @IsOptional()
  address?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({unique: true})
  propertyId: string;

  @OneToOne(() => Property, (property) => property.propertyDetails)
  @JoinColumn()
  property: Property;
}
