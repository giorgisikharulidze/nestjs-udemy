import { IsEnum, IsOptional } from 'class-validator';
import { AttendeeAnswerEnum } from '../enums/atandee-answer.enum';

export class CreateAttandeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
