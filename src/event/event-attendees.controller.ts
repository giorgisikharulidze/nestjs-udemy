import { Controller, Get, Param } from "@nestjs/common";
import { AttendeesService } from "./attendees.service";
import { Attendee } from "./attandee.entity";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { FindOneParams } from "../common/find-one.params";

@ApiBearerAuth()
@Controller('events/:eventId/atendees')
export class EventAttendeesController{
constructor(

    private readonly attendeesService: AttendeesService
){}


@Get()
@ApiParam({ name: 'id', type: String, description: 'Event ID' })
async findAll(@Param() param: FindOneParams):Promise<Attendee[]>{
return await this.attendeesService.findByEventId(param.id);
}
}