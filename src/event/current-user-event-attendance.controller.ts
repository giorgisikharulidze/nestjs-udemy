import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EventService } from './event.service';
import { AttendeesService } from './attendees.service';
import { FindOneParams } from '../common/find-one.params';
import { CreateAttandeeDto } from './dtos/create-attendee.dto';
import { CurrentUserId } from '../users/decorator/current-user-id.decorator';
import { AttendeeAnswerEnum } from './attandee.entity';
import { PaginationParams } from 'src/common/pagination.params';

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
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  async findOne(
    @Param() eventId: FindOneParams,
    @CurrentUserId() userId: string,
  ) {
    const attendee = await this.attendeesService.findOneByEventIdAndUserId(
      eventId.id,
      userId,
    );

    if (!attendee) {
      throw new NotFoundException();
    }
    return attendee;
  }

  @Put('/:eventId')
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
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
    @Param() eventId: FindOneParams,
    @Body() createAttendeeDto: CreateAttandeeDto,
    @CurrentUserId() userId: string,
  ) {
    return this.attendeesService.createOrUpdate(
      createAttendeeDto,
      eventId.id,
      userId,
    );
  }
}
