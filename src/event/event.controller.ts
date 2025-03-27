import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { CurrentUserId } from '../users/decorator/current-user-id.decorator';
import { PaginationParams } from '../common/pagination.params';
import { CreateEventDto } from './dtos/create-event.dto';
import { Event } from './event.entity';
import { FindOneParams } from '../common/find-one.params';

@ApiBearerAuth()
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
    const [items, total] = await this.eventService.findAll(pagination);

    return {
      data: items,
      meta: {
        total,
        ...pagination,
      },
    };
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
    return await this.eventService.findOne(eventId.id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'Event ID' })
  public async deleteEvent(@Param() eventId: FindOneParams):Promise<void>{

    const event = await this.eventService.findOne(eventId.id);
    if(!event){
        throw new NotFoundException();
    }
    await this.eventService.deleteEvent(event);
  }
}
