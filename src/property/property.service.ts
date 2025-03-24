import { Get, Injectable } from '@nestjs/common';
import { QueryBuilder, Repository } from 'typeorm';
import { Property } from './property.entity';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePropertyDto } from './create-property.dto';
import { UpdatePropertyDto } from './update-property.dto';
import { PropertyDetails } from './property-details.entity';
import { PaginationParams } from 'src/common/pagination.params';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PropertyDetails)
    private readonly propertyDetailsRepository: Repository<PropertyDetails>,
  ) {}

  public async findAll(
    pagination: PaginationParams,
  ): Promise<[Property[], number]> {
    const query = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.propertyDetails', 'propertyDetails');

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
  ): Promise<Property> {
    // 1️⃣ Property-ის შექმნა, მაგრამ ჯერ PropertyDetails არ ინახება
    const property = this.propertyRepository.create(createPropertyDto);
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

    return await this.propertyRepository.save(property);
  }
  public async deleteProperty(property: Property): Promise<void> {
    this.propertyRepository.delete(property.id);
  }
}
