import { randomUUID } from 'node:crypto';
import { CreateTaskDto } from './create-task.dto';
import { ITask } from './task.model';
import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './update-task.dto';

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
        Object.assign(task,updateTaskDto);
        return task;
    }

}
