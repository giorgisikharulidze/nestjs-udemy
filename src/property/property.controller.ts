import {
  BadRequestException,
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
import { CreatePropertyDto } from './dtos/create-property.dto';
import { FindOneParams } from '../common/find-one.params';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import { PaginationParams } from '../common/pagination.params';
import { PaginationResponse } from '../common/pagination.response';
import { CurrentUserId } from '../users/decorator/current-user-id.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@ApiBearerAuth()
@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly logger: WinstonLoggerService,
  ) {}

  @Get('/details') // Change the path for this method
  @ApiOperation({ summary: 'Get Property Details with Procedure' })
  public async getPropertyDetailsWithProcedure(
    @CurrentUserId() userId: string,
  ): Promise<any> {
    let result =
      await this.propertyService.getPropertyDetailsWithProcedure(userId);
    result = result.map((item) => ({
      data: {
        id: item.id,
        name: item.name,
        type: item.type,
        details: {
          make: item.make,
          model: item.model,
          address: item.address,
        },
      },
    }));
    return result;
  }

  @Get('/all') // Different path for this method
  @ApiOperation({ summary: 'Get All Properties' })
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
    const property = await this.propertyService.createProperty(
      createPropertyDto,
      userId,
    );
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
  @ApiParam({ name: 'id', type: String, description: 'Property ID' })
  @ApiBody({
    description: 'Create property with property details',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'House 01' },
        type: { type: 'string', example: 'REAL_ESTATE' },
        propertyDetails: {
          type: 'object',
          properties: {
            make: { type: 'string', example: 'BWM' },
            model: { type: 'string', example: 'X5' },
            address: { type: 'string', example: '' },
          },
        },
      },
    },
  })
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
