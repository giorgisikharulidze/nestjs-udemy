import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from './task.model';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @MinLength(1)
  @IsString()
  search?: string;
}
