import { Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from './event.entity';
import { User } from "../../users/entities/user.entity";
import { AttendeeAnswerEnum } from "../enums";


@Entity()
export class Attendee {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: true
  })
  @JoinColumn()
  event: Event;

  @Column()
  eventId: string;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted
  })
  @Expose()
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => User, (user) => user.attended)
  @Expose()
  user: User;

  @Column()
  userId: string;
}