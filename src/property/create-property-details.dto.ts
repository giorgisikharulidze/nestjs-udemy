import { IsOptional, IsString } from "class-validator";
import { Column } from "typeorm";

export class CreatePropertyDetailsDto{
    
      @Column()
      @IsOptional()
      make?: string;
    
      @Column()
      @IsOptional()
      model?: string;
    
      @Column()
      @IsOptional()
      address?: string;

//      @Column()
//     @IsString()
//      propertyId:string
    
}