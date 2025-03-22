import { Get, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Property } from './property.entity';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePropertyDto } from './create-property.dto';

@Injectable()
export class PropertyService {

    constructor(
        @InjectRepository(Property)
        private readonly propertyRepository: Repository<Property>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    public async findAll(): Promise<Property[]>{
        return await this.propertyRepository.find();
    }

    public async findOne(id:string):Promise<Property | null>{
        return await this.propertyRepository.findOne(
            {
                where: {id}
            }
        )
    }

    public async createProperty(createPopertyDto: CreatePropertyDto): Promise<Property>{

        return await this.propertyRepository.save(createPopertyDto);
    }

    public async deleteProperty(property: Property): Promise<void>{
        this.propertyRepository.delete(property.id);
    }
}
