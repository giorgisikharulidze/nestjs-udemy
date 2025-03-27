import { Injectable, Param } from '@nestjs/common';
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
    ){}


        public async findAll(pagination: PaginationParams, userId: string):Promise<[Event[], number]>{

            const query = this.eventRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.attendees', 'atandee')
            .andWhere('event.userId = :userId',{userId});

            query.skip(pagination.limit).take(pagination.offset);


            return query.getManyAndCount(); 
        }


        public async findOne(event_id: string):Promise<Event[]>{

            const query = this.eventRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.attendees', 'atandee')
            .andWhere('event.id = :id',{event_id});

            return query.getMany(); 
        }

        public async  createEvent(createEvent: CreateEventDto): Promise<Event> {

            return this.eventRepository.save(createEvent);

            
        }

        public async updateEvent(event: Event, updateEvent: UpdateEventDto): Promise<Event>{

            Object.assign(event , updateEvent)
            return await this.eventRepository.save(event)
        }

        public async deleteEvent(event: Event):Promise<void>{

            await this.eventRepository.delete(event.id);
        }


        

}
