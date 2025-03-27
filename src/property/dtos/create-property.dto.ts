import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PropertyType } from '../enums/property-type.enum';
import { Type } from 'class-transformer';
import { CreatePropertyDetailsDto } from './create-property-details.dto';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(PropertyType)
  type: PropertyType;

//  @IsNotEmpty()
//  @IsUUID()
//  userId: string;


  @ValidateNested({ each: true })
  @Type(() => CreatePropertyDetailsDto)
  propertyDetails: CreatePropertyDetailsDto;
}
