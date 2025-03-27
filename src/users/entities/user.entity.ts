import { Expose } from 'class-transformer';
import { Property } from  '../../property/entities/property.entity';
import { Task } from '../../tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './../enums/role.enum';
import { Attendee } from '../../event/entities/attandee.entity';
import { Event } from '../../event/entities/event.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @Expose()
  name: string;

  @Column()
  @Expose()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  @Expose()
  tasks: Task[];

  @OneToMany(() => Property, (property) => property.user)
  @Expose()
  properties: Property[];

  @Column('text', { array: true, default: [Role.USER] })
  @Expose()
  roles: Role[];

  @OneToMany(() => Event, (event) => event.organizer)
  @Expose()
  organized: Event[];

  @OneToMany(() => Attendee, (attendee) => attendee.user)
  attended: Attendee[];
}
