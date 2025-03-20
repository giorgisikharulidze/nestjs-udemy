import { randomUUID } from 'node:crypto';
import { CreateTaskDto } from './create-task.dto';
import { ITask, TaskStatus } from './task.model';
import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';

@Injectable()
export class TasksService {
   
    private tasks: ITask[]= [];

    findAll(): ITask[] {
        return this.tasks;
    }

    findOne(id:string): ITask | undefined{

    return this.tasks.find(task => task.id===id);
    }

    create(createTaskDto: CreateTaskDto): ITask{

        const task: ITask = {
            id: randomUUID(),
            ...createTaskDto
        };

        this.tasks.push(task);

        return task;

    }

    public deleteTask(task: ITask): void{
        this.tasks = this.tasks.filter(
            filteredTask=> filteredTask.id !== task.id
        );

    }

    public updateTask(task: ITask, updateTaskDto: UpdateTaskDto): ITask{
        if(
            updateTaskDto.status && !this.isValideStatusTransition(task.status,updateTaskDto.status)
          ) 
        {
            throw new WrongTaskStatusException(); 
        }
        Object.assign(task,updateTaskDto);
        return task;
    }

    private isValideStatusTransition(
        currentStatus: TaskStatus,
    newStatus:TaskStatus): boolean
    {
        const statusOrder = [
         TaskStatus.OPEN,
         TaskStatus.IN_PROGRESS,
         TaskStatus.DONE   
        ];
        return statusOrder.indexOf(currentStatus)<= statusOrder.indexOf(newStatus);

    }

}
