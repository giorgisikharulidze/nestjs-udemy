import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { Attendee } from './attandee.entity';
import { AttendeesService } from './attendees.service';
import { EventAttendeesController } from './event-attendees.controller';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, Attendee])],    
  controllers: [EventController, EventAttendeesController, EventsOrganizedByUserController],
  providers: [EventService, AttendeesService],
//  exports: [EventService]
})
export class EventModule {}
