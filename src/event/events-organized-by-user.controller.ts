import { Controller, Get, Query } from "@nestjs/common";
import { EventService } from "./event.service";
import { CurrentUserId } from "../users/decorator/current-user-id.decorator";
import { PaginationParams } from "../common/pagination.params";
import { ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger";

@ApiBearerAuth()
@Controller('events-organized-by-user')
export class EventsOrganizedByUserController{
    constructor(
        private readonly eventService: EventService
    ){}

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
    @Query() pagination: PaginationParams)
    {
        return await this.eventService.getEventsOrganizedByUserIdPaginated(
            userId, pagination
        )
    }

}