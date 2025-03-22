import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PropertyType } from './property.model';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(PropertyType)
  type: PropertyType;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
