import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property } from './property.entity';
import { PropertyDetails } from './property-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, PropertyDetails])],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
