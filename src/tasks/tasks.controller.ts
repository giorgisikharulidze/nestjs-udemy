import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from 'src/common/pagination.params';
import { PaginationResponse } from 'src/common/pagination.response';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  public async findAll(@Query() 
  filters: FindTaskParams,
  @Query() pagination: PaginationParams
): Promise<PaginationResponse<Task>> {
    const [items, total] =  await this.taskService.findAll(filters,pagination);

    return {
      data: items,
      meta: {
        total,
        ...pagination
//        offset: pagination.offset,
//        limit: pagination.limit
      },
    };
  }

  @Get('/:id')
  public async findOne(@Param() params: FindOneParams): Promise<Task> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  /*    @Patch(':id/status')
    public updateTaskStatus(
        @Param() params: FindOneParams,
        @Body() updateTaskDto: UpdateTaskStatusDto
    ): ITask{
        const task = this.findOneOrFail(params.id);
        task.status = updateTaskDto.status;

        return task;

    }*/

  @Patch(':id')
  public async updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    try {
      return await this.taskService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.taskService.deleteTask(task);
  }

  // 1) Create an endpoint :id/labels
  // 2) addLabels - mixing existing labels with ne ones
  // 3) 500 - with need a method to get unique labels to store

  @Post(':id/labels')
  public async addlabels(
    @Param() params: FindOneParams,
    @Body() labels: CreateTaskLabelDto[],
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);

    return await this.taskService.addLabels(task, labels);
  }

  @Delete('/:id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeLabels(
    @Param() params: FindOneParams,
    @Body() labelNames: string[],
  ): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.taskService.removeLebels(task, labelNames);
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.taskService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }
    return await task;
  }
}
