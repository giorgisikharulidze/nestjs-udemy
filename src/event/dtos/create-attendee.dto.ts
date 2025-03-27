import { IsEnum } from 'class-validator';
import { AttendeeAnswerEnum } from '../attandee.entity';

export class CreateAttandeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
