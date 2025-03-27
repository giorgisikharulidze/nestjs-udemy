import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './atandee.entity';
import { Repository } from 'typeorm';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}


  public async findByEventId(eventId: string): Promise<Attendee[]> {
    
    return    await this.attendeeRepository.find({
        where: {event: {id: eventId}}
    });

  }
}
