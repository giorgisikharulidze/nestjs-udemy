import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PropertyController } from './property.controller';
import { PropertyService } from './services/property.service';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { Property } from './entities/property.entity';
import { PropertyDetails } from './entities/property-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, PropertyDetails])],
  controllers: [PropertyController],
  providers: [PropertyService, WinstonLoggerService],
})
export class PropertyModule {}
