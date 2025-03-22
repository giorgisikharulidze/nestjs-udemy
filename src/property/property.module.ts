import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property } from './property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property])],
  controllers: [PropertyController],
  providers: [PropertyService]
})
export class PropertyModule {}
