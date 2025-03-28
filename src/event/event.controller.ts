import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EventService } from './services/event.service';
import { CurrentUserId } from '../users/decorator/current-user-id.decorator';
import { PaginationParams } from '../common/pagination.params';
import { CreateEventDto } from './dtos/create-event.dto';
import { Event } from './entities/event.entity';
import { FindOneParams } from '../common/find-one.params';
import { UpdateEventDto } from './dtos/update-event.dto';

@ApiBearerAuth()
@ApiTags('Events')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiQuery({
    name: 'limit',
    required: false, // ეს პარამეტრი არ არის აუცილებელი
    description: 'Number of properties to return',
    type: Number,
    example: 100,
  })
  @ApiQuery({
    name: 'offset',
    required: false, // ეს პარამეტრი არ არის აუცილებელი
    description: 'Offset for pagination',
    type: Number,
    example: 0,
  })
  public async findAll(@Query() pagination: PaginationParams) {
    return await this.eventService.getEventWithAttendeeCountPagination(
      pagination,
    );
  }

  @Post()
  @ApiBody({
    description: 'Create Event',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'NestJS Conference' },
        description: { type: 'string', example: 'NestJS meetup' },
        when: { type: 'string', example: '2025-03-17T11:30:00.000Z' },
        address: { type: 'string', example: 'Online' },
      },
    },
  })
  public async createEvent(
    @Body() CreateEventDto: CreateEventDto,
    @CurrentUserId() userId: string,
  ): Promise<Event> {
    return await this.eventService.createEvent(CreateEventDto, userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  public async findOne(@Param() eventId: FindOneParams): Promise<Event | null> {
    return await this.eventService.getEventWithAttendeeCount(eventId.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  public async deleteEvent(@Param() eventId: FindOneParams): Promise<void> {
    const event = await this.eventService.findOne(eventId.id);
    if (!event) {
      throw new NotFoundException();
    }
    await this.eventService.deleteEvent(event);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  @ApiBody({
    description: 'Update Event',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'NestJS Conference Update' },
        description: { type: 'string', example: 'NestJS meetup' },
        when: { type: 'string', example: '2025-03-30T11:30:00.000Z' },
        address: { type: 'string', example: 'Online' },
      },
    },
  })
  public async updateEvent(
    @Param() params: FindOneParams,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUserId() userId: string,
  ): Promise<Event> {
    const event = await this.eventService.findOne(params.id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== userId) {
      throw new ForbiddenException(
        null,
        'You are not authrized to change this event',
      );
    }

    return this.eventService.updateEvent(event, updateEventDto);
  }
}
