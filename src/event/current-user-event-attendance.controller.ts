import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EventService } from './services/event.service';
import { AttendeesService } from './services/attendees.service';
import { CreateAttandeeDto } from './dtos/create-attendee.dto';
import { CurrentUserId } from '../users/decorator/current-user-id.decorator';
import { AttendeeAnswerEnum } from './entities/attandee.entity';
import { PaginationParams } from '../common/pagination.params';

@ApiBearerAuth()
@Controller('events-attendance')
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventService: EventService,
    private readonly attendeesService: AttendeesService,
  ) {}

  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of properties to return',
    type: Number,
    example: 100,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
    type: Number,
    example: 0,
  })
  async findAll(
    @CurrentUserId() userId: string,
    @Query() pagination: PaginationParams,
  ) {
    return await this.eventService.getEventsOrganizedByUserIdPaginated(
      userId,
      pagination,
    );
  }

  @Get('/:eventId')
  @ApiParam({ name: 'eventId', type: String, description: 'Event ID' })
  async findOne(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @CurrentUserId() userId: string,
  ) {
    const attendee = await this.attendeesService.findOneByEventIdAndUserId(
      eventId,
      userId,
    );

    if (!attendee) {
      throw new NotFoundException();
    }
    return attendee;
  }

  @Put('/:eventId')
  @ApiParam({ name: 'eventId', type: String, description: 'Event ID' })
  @ApiBody({
    description: 'Create or update attendee',
    schema: {
      type: 'object',
      properties: {
        answer: {
          type: 'string',
          enum: Object.values(AttendeeAnswerEnum),
          example: AttendeeAnswerEnum.Accepted,
        },
      },
    },
  })
  async createOrUpdate(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Body() createAttendeeDto: CreateAttandeeDto,
    @CurrentUserId() userId: string,
  ) {
    return this.attendeesService.createOrUpdate(
      createAttendeeDto,
      eventId,
      userId,
    );
  }
}
