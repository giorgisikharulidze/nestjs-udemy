import { IsEnum, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from './task.model';
import { Transform } from 'class-transformer';
import { filter } from 'rxjs';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @MinLength(1)
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }: { value?: string }) => {
    if (!value) return undefined;
    return value
      .split(',')
      .map((label) => label.trim())
      .filter((label) => filter.length);
  })
  labels?: string[];

  @IsOptional()
  @IsIn(['title', 'status','createdAt'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
