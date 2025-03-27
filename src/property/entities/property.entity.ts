import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PropertyDetails } from './property-details.entity';
import { PropertyType } from '../enums/property-type.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  type: PropertyType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.properties)
  user: User;

  @OneToOne(()=> PropertyDetails,(propertyDetails)=>propertyDetails.property,{
    onDelete: 'CASCADE'
  })
  propertyDetails: PropertyDetails

}
