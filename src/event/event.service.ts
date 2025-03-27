import { Injectable, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dtos/create-event.dto';
import { PaginationParams } from '../common/pagination.params';
import { Event } from './event.entity';
import { UpdateEventDto } from './dtos/update-event.dto';
import { PaginationResponse } from '../common/pagination.response';
import { paginate } from '../common/paginator';
import { AttendeeAnswerEnum } from './attandee.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  public async getEventWithAttendeeCount(
    eventId: string,
  ): Promise<Event | null> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { eventId },
    );
    return await query.getOne();
  }

  public async getEventWithAttendeeCountPagination(
    pagination: PaginationParams,
  ): Promise<PaginationResponse<Event>> {
    return await paginate(this.getEventsWithAttendeeCountQuery(), pagination);
  }

  public async findAll(
    pagination: PaginationParams,
  ): Promise<[Event[], number]> {
    const query = this.getEventsBaseQuery().leftJoinAndSelect(
      'e.attendees',
      'atandee',
    );

    query.skip(pagination.offset).take(pagination.limit);
    return await query.getManyAndCount();
  }

  public async findOne(eventId: string): Promise<Event | null> {
    const query = this.getEventsBaseQuery()
      .leftJoinAndSelect('e.attendees', 'atandee')
      .andWhere('e.id = :eventId', { eventId });

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

  public async getEventsOrganizedByUserIdPaginated(
    userId: string,
    pagination: PaginationParams,
  ): Promise<PaginationResponse<Event>> {
    return paginate(this.getEventsOrganizedByUserIdQuery(userId), pagination);
  }

  private getEventsOrganizedByUserIdQuery(userId: string) {
    return this.getEventsBaseQuery().where('e.organizerId = :userId', {
      userId,
    });
  }

  public async getEventsAttendedByUserIdPaginated(
    userId: string,
    pagination: PaginationParams,
  ): Promise<PaginationResponse<Event>> {
    return paginate(this.getEventsOrganizedByUserIdQuery(userId), pagination);
  }

  private getEventsAttendedByUserIdQuery(userId: string) {
    return this.getEventsBaseQuery()
      .leftJoinAndSelect('e.atendees', 'a')
      .where('a.userId = :userId', { userId });
  }
}
