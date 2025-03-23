import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from './task.model';
import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { TaskLabel } from './task-label.entity';
import { FindTaskParams } from './find-task.params';
import { PaginationParams } from 'src/common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private readonly labelsRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(
    filters: FindTaskParams,
    pagination: PaginationParams

  ): Promise<[Task[], number]> {

    const where: FindOptionsWhere<Task>={};

    if(filters.status){
      where.status = filters.status;
    }
    if(filters.search?.trim()){
      where.title = Like(`%${filters.search}%`);
      where.description = Like(`%${filters.search}%`);
    }

    return await this.taskRepository.findAndCount({
      where,
      relations: ['labels'],
      skip: pagination.offset,
      take: pagination.limit
    });
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.taskRepository.save(createTaskDto);
  }

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValideStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  public async addLabels(
    task: Task,
    lableDtos: CreateTaskLabelDto[],
  ): Promise<Task> {
    // 1) dublicate dtos
    //2) get existing names
    // 3) new labels aren't already existing ones
    // 4) we save new ones, only if there are any real new ones

    const names = new Set(task.labels.map((label) => label.name)); //1

    const labels = this.getUniqueLabels(lableDtos) //2
      .filter((dto) => !names.has(dto.name)) //3
      .map((label) => this.labelsRepository.create(label));

    //4
    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.taskRepository.save(task);
    }

    return task;
  }

  public async removeLebels(
    task: Task,
    labelsToRemove: string[],
  ): Promise<Task> {
    // 1. remove existing labels from labals array
    // 2. way to solve
    //  a) remove labels from task-> labels and save() the task
    //  b) query builder -  sql that deletes labels

    task.labels = task.labels.filter(
      (label) => !labelsToRemove.includes(label.name),
    );

    return await this.taskRepository.save(task);
  }

  public async deleteTask(task: Task): Promise<void> {
    //        await this.taskRepository.remove(task);
    await this.taskRepository.delete(task.id);
  }

  private isValideStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  private getUniqueLabels(
    labelDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelDtos.map((label) => label.name))];
    return uniqueNames.map((name) => ({ name }));
  }
}
