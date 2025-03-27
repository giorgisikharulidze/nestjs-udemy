import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attandee.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public async findByEventId(eventId: string): Promise<Attendee[]> {
    return await this.attendeeRepository.find({
      where: { event: { id: eventId } },
    });
  }

  public async findOneByEventIdAndUserId(
    eventId: string,
    userId: string,
  ): Promise<Attendee | null> {
    return await this.attendeeRepository.findOne({
      where: { event: { id: eventId }, user: { id: userId } },
    });
  }

  public async createOrUpdate(
    input: any,
    eventId: string,
    userId: string,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByEventIdAndUserId(eventId, userId)) ?? new Attendee();

    attendee.name = '';
    attendee.eventId = eventId;
    attendee.userId = userId;
    attendee.answer = input.answer;

    return await this.attendeeRepository.save(attendee);
  }
}
