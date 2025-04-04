import { Get, Injectable } from '@nestjs/common';
import { DataSource, QueryBuilder, Repository } from 'typeorm';
import { Property } from './../entities/property.entity';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePropertyDto } from '../dtos/create-property.dto';
import { UpdatePropertyDto } from '../dtos/update-property.dto';
import { PropertyDetails } from './../entities/property-details.entity';
import { PaginationParams } from '../../common/pagination.params';
import { WinstonLoggerService } from '../../logger/winston-logger.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PropertyDetails)
    private readonly propertyDetailsRepository: Repository<PropertyDetails>,
    private dataSource: DataSource,
    private readonly logger: WinstonLoggerService,
    
  ) {}
  public async findAll(
    pagination: PaginationParams,
    userId: string,
  ): Promise<[Property[], number]> {
    const query = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.propertyDetails', 'propertyDetails');

    query.andWhere('property.userId = :userId', { userId });
    query.skip(pagination.offset).take(pagination.limit);

    return await query.getManyAndCount(); //this.propertyRepository.find();
  }

  public async findOne(id: string): Promise<Property | null> {
    return await this.propertyRepository.findOne({
      where: { id },
      relations: ['propertyDetails'],
    });
  }

  public async createProperty(
    createPropertyDto: CreatePropertyDto,
    userId: string,
  ): Promise<Property> {
    // 1️⃣ Property-ის შექმნა, მაგრამ ჯერ PropertyDetails არ ინახება
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      userId,
    });
    await this.propertyRepository.save(property);

    // 2️⃣ PropertyDetails-ის ცალკე შენახვა
    if (createPropertyDto.propertyDetails) {
      const details = this.propertyDetailsRepository.create({
        ...createPropertyDto.propertyDetails,
        property: property, // Foreign Key-ს ვაყენებთ Property-ზე
      });

      await this.propertyDetailsRepository.save(details);
      //property.propertyDetails = details;
    }

    return property;
  }

  public async updateProperty(
    property: Property,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    Object.assign(property, updatePropertyDto);

    if (updatePropertyDto.propertyDetails) {
      const existingDetails = await this.propertyDetailsRepository.findOne({
        where: { propertyId: property.id },
      });

      if (existingDetails) {
        // Update existing record
        Object.assign(existingDetails, updatePropertyDto.propertyDetails);
        await this.propertyDetailsRepository.save(existingDetails);
      }
    }

    return await this.propertyRepository.save(property);
  }

  public async deleteProperty(property: Property): Promise<void> {
    await this.propertyDetailsRepository.delete({ propertyId: property.id });
    await this.propertyRepository.delete(property.id);
  }

  public async getPropertyDetailsWithProcedure(userId: string): Promise<any[]> {
      return await this.dataSource.query(`SELECT * FROM get_user_properties($1)`, [userId]);
  }
}
