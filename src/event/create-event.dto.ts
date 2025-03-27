import { IsDateString, isDateString, IsNotEmpty } from "class-validator";

export class CreateEventDto{
      
      @IsNotEmpty()
      name: string;
      

      @IsNotEmpty()
      description: string;
    
      @IsNotEmpty()
      @IsDateString()
      when: Date;
    
      @IsNotEmpty()
      address: string;
    
    
}
