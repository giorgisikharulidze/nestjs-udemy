import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './property.entity';
import { CreatePropertyDto } from './create-property.dto';
import { FindOneParams } from './find-one.params';
import { UpdatePropertyDto } from './update-property.dto';
import { PaginationParams } from '../common/pagination.params';
import { PaginationResponse } from '../common/pagination.response';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  public async findAll(
    @Query() pagination: PaginationParams,
  ): Promise<PaginationResponse<Property>> {
    const [items, total] = await this.propertyService.findAll(pagination);

    return {
      data: items,
      meta: {
        total,
        ...pagination,
      },
    };
  }

  @Get('/:id')
  public async findOne(@Param() params: FindOneParams): Promise<Property> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async createProperty(
    @Body() createPropertyDto: CreatePropertyDto,
  ): Promise<Property> {
    return await this.propertyService.createProperty(createPropertyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteProperty(@Param() params: FindOneParams): Promise<void> {
    const property = await this.findOneOrFail(params.id);

    await this.propertyService.deleteProperty(property);
  }

  @Patch(':id')
  public async updateProperty(
    @Param() params: FindOneParams,
    @Body() updateProperty: UpdatePropertyDto,
  ) {
    const property = await this.findOneOrFail(params.id);

    return await this.propertyService.updateProperty(property, updateProperty);
  }

  private async findOneOrFail(id: string): Promise<Property> {
    const property = await this.propertyService.findOne(id);

    if (!property) {
      throw new NotFoundException();
    }
    return property;
  }
}
