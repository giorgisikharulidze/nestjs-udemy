import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './services/event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { User } from '../users/entities/user.entity';
import { Attendee } from './entities/attandee.entity';
import { AttendeesService } from './services/attendees.service';
import { EventAttendeesController } from './event-attendees.controller';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, Attendee])],
  controllers: [
    EventController,
    EventAttendeesController,
    EventsOrganizedByUserController,
    CurrentUserEventAttendanceController,
  ],
  providers: [EventService, AttendeesService],
})
export class EventModule {}
