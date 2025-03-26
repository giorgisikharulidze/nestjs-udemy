import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { PaginationParams } from '../common/pagination.params';
import { PaginationResponse } from '../common/pagination.response';
import { CurrentUserId } from './../users/decorator/current-user-id.decorator';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  public async findAll(
    @Query()
    filters: FindTaskParams,
    @Query() pagination: PaginationParams,
    @CurrentUserId() userId: string,
  ): Promise<PaginationResponse<Task>> {
    const [items, total] = await this.taskService.findAll(
      filters,
      pagination,
      userId,
    );

    return {
      data: items,
      meta: {
        total,
        ...pagination,
        //        offset: pagination.offset,
        //        limit: pagination.limit
      },
    };
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String, description: 'Task ID' }) 
  public async findOne(
    @Param() params: FindOneParams,
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    this.checkTaskOwnership(task, userId);

    return task;
  }

  @Post()
  @ApiBody({
    description: 'Create a new task',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'ALearn 123' },
        description: { type: 'string', example: 'Complete the NestJS Course' },
        status: { type: 'string', example: 'OPEN' },
        userId: { type: 'string', format: 'uuid', example: '42ccff11-d170-4650-b5d4-7085a2f8a378' },
        labels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' }
            }
          },
          example: [
            { name: 'urgent' },
            { name: 'priority' }
          ]
        }
      }
    }
  })
  public async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    return await this.taskService.createTask({
      ...createTaskDto,
      userId,
    });
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
  @ApiParam({ name: 'id', type: String, description: 'Task ID' })
  @ApiBody({
    description: 'Update a task and labels',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'ALearn 123' },
        description: { type: 'string', example: 'Complete the NestJS Course' },
        status: { type: 'string', example: 'OPEN' },
        userId: { type: 'string', format: 'uuid', example: '42ccff11-d170-4650-b5d4-7085a2f8a378' },
        labels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' }
            }
          },
          example: [
            { name: 'urgent 2' },
            { name: 'priority 2' }
          ]
        }
      }
    }
  })
  public async updateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    this.checkTaskOwnership(task, userId);

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
  @ApiParam({ name: 'id', type: String, description: 'Task ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(
    @Param() params: FindOneParams,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    this.checkTaskOwnership(task, userId);

    await this.taskService.deleteTask(task);
  }

  // 1) Create an endpoint :id/labels
  // 2) addLabels - mixing existing labels with ne ones
  // 3) 500 - with need a method to get unique labels to store

  @Post(':id/labels')
  @ApiParam({ name: 'id', type: String, description: 'Task ID' })
  @ApiBody({
    description: 'Add specific labels to a task',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'prioritized' }
        }
      },
      example: [
        { name: 'prioritized' },
        { name: 'bug' }
      ]
    }
  })
  public async addlabels(
    @Param() params: FindOneParams,
    @Body() labels: CreateTaskLabelDto[],
    @CurrentUserId() userId: string,
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    this.checkTaskOwnership(task, userId);
    return await this.taskService.addLabels(task, labels);
  }

  @Delete('/:id/labels')
  @ApiParam({ name: 'id', type: String, description: 'Task ID' })
  @ApiBody({
    description: 'Remove specific labels from a task',
    schema: {
      type: 'array',
      items: {
        type: 'string'
      },
      example: ["prioritized", "bug"]
    }
  })  
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeLabels(
    @Param() params: FindOneParams,
    @Body() labelNames: string[],
    @CurrentUserId() userId: string,
  ): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    this.checkTaskOwnership(task, userId);
    await this.taskService.removeLebels(task, labelNames);
  }

  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.taskService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }
    return await task;
  }

  private checkTaskOwnership(task: Task, userId: string): void {
    if (task.userId !== userId) {
      throw new ForbiddenException('You can only acess your own tasks');
    }
  }
}
