import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './property.entity';
import { FindOneOptions } from 'typeorm';
import { FindOneParams } from 'src/tasks/find-one.params';
import { CreatePropertyDto } from './create-property.dto';

@Controller('property')
export class PropertyController {

    constructor(
        private readonly propertyService: PropertyService){}


      @Get()  
      public async findAll():Promise<Property[]>{
        return await this.propertyService.findAll();
      }  

      @Get('/:id')
      public async findOne(
        @Param() params: FindOneParams
      ): Promise<Property>{
        return await this.findOneOrFail(params.id);
      }

      @Post()
      public async createProperty(
        @Body() createPropertyDto: CreatePropertyDto
      ): Promise<Property>{
        return await this.propertyService.createProperty(createPropertyDto);
      }

      @Delete(':id')
      @HttpCode(HttpStatus.NO_CONTENT)
      public async deleteProperty(
        @Param() params: FindOneParams):Promise<void>{
            const property = await this.findOneOrFail(params.id);

            await this.propertyService.deleteProperty(property);
            
        }
      



      private async findOneOrFail(id:string): Promise<Property>{

        const property= await this.propertyService.findOne(id);

        if(!property){

            throw new NotFoundException;
        }
        return property;
      }



}
