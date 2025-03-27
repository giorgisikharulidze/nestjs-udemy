import { IsEnum, IsOptional } from 'class-validator';
import { AttendeeAnswerEnum } from '../entities/attandee.entity';

export class CreateAttandeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
