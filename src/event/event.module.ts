import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { User } from '../users/user.entity';
import { Attendee } from './atandee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, Attendee])],    
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
