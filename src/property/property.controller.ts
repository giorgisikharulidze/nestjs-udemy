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
import { PropertyService } from './property.service';
import { Property } from './property.entity';
import { CreatePropertyDto } from './create-property.dto';
import { FindOneParams } from './find-one.params';
import { UpdatePropertyDto } from './update-property.dto';
import { PaginationParams } from '../common/pagination.params';
import { PaginationResponse } from '../common/pagination.response';
import { CurrentUserId } from '../users/decorator/current-user-id.decorator';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}


  @Get()
  public async findAll(
    @Query() pagination: PaginationParams,
    @CurrentUserId() userId: string,
  ): Promise<PaginationResponse<Property>> {
    const [items, total] = await this.propertyService.findAll(
      pagination,
      userId,
    );

    return {
      data: items,
      meta: {
        total,
        ...pagination,
      },
    };
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String, description: 'Property ID' }) // აქ პარამეტრი განვსაზღვრეთ
  public async findOne(
    @Param() params: FindOneParams,
    @CurrentUserId() userId: string,
  ): Promise<Property> {
    const property = await this.findOneOrFail(params.id);
    this.checkPropertyOwnership(property, userId);
    return property;
  }

  @Post()
  @ApiBody({
    description: 'Create property with property details',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'House 01' },
        type: { type: 'string', example: 'REAL_ESTATE' },
        userId: { type: 'string', format: 'uuid', example: '42ccff11-d170-4650-b5d4-7085a2f8a378' },
        propertyDetails: {
          type: 'object',
          properties: {
            make: { type: 'string', example: 'subaru' },
            model: { type: 'string', example: 'crosstrek XV' },
            address: { type: 'string', example: '' },            
          },
        },
      },
    },
  })
  public async createProperty(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUserId() userId: string,
  ): Promise<Property> {
    const property =
      await this.propertyService.createProperty(createPropertyDto);
    this.checkPropertyOwnership(property, userId);
    return property;
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'Property ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteProperty(
    @Param() params: FindOneParams,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    const property = await this.findOneOrFail(params.id);
    this.checkPropertyOwnership(property, userId);
    await this.propertyService.deleteProperty(property);
  }

  @Patch(':id')
  public async updateProperty(
    @Param() params: FindOneParams,
    @Body() updateProperty: UpdatePropertyDto,
    @CurrentUserId() userId: string,
  ) {
    const property = await this.findOneOrFail(params.id);
    this.checkPropertyOwnership(property, userId);

    return await this.propertyService.updateProperty(property, updateProperty);
  }

  private async findOneOrFail(id: string): Promise<Property> {
    const property = await this.propertyService.findOne(id);

    if (!property) {
      throw new NotFoundException();
    }
    return property;
  }

  private checkPropertyOwnership(property: Property, userId: string): void {
    if (property.userId !== userId) {
      throw new ForbiddenException('You can only acess your own properties');
    }
  }
}
