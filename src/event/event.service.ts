import { Injectable, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './create-event.dto';
import { PaginationParams } from '../common/pagination.params';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  public async findAll(
    pagination: PaginationParams,
  ): Promise<[Event[], number]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.attendees', 'atandee');

    query.skip(pagination.offset).take(pagination.limit);

    //    console.log('SQL Query:', query.getSql());
    //   console.log('Full Query with Params:', query.getQueryAndParameters());
    //    console.log(await query.getManyAndCount());
    return await query.getManyAndCount();
  }

  public async findOne(eventId: string): Promise<Event | null> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.attendees', 'atandee')
      .andWhere('event.id = :eventId', { eventId });

    return query.getOne();
  }

  public async createEvent(
    createEvent: CreateEventDto,
    userId: string,
  ): Promise<Event> {
    return await this.eventRepository.save({
      ...createEvent,
      organizerId: userId,
      when: new Date(createEvent.when),
    });
  }

  public async updateEvent(
    event: Event,
    updateEvent: UpdateEventDto,
  ): Promise<Event> {
    Object.assign(event, updateEvent);
    return await this.eventRepository.save(event);
  }

  public async deleteEvent(event: Event): Promise<void> {
    await this.eventRepository.delete(event.id);
  }
}
