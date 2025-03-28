import { IsEnum} from 'class-validator';
import { AttendeeAnswerEnum } from '../enums';

export class CreateAttandeeDto {
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
