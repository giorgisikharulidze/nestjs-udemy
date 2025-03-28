import { Controller, Get, Param } from '@nestjs/common';
import { AttendeesService } from './services/attendees.service';
import { Attendee } from './entities/attandee.entity';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Events')
@Controller('events/:eventId/attendees')
export class EventAttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get()
  @ApiParam({ name: 'eventId', type: String, description: 'Event ID' })
  async findAll(@Param('eventId') eventId: string): Promise<Attendee[]> {
    return await this.attendeesService.findByEventId(eventId);
  }
}
