import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property } from './property.entity';
import { PropertyDetails } from './property-details.entity';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, PropertyDetails])],
  controllers: [PropertyController],
  providers: [PropertyService, WinstonLoggerService],
})
export class PropertyModule {}
