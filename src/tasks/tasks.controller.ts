import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { response } from 'express';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';

@Controller('tasks')
export class TasksController {

    constructor(private readonly taskService: TasksService){}
    
    @Get()
    public findAll():ITask[]{
        return this.taskService.findAll()
    }

    @Get('/:id')
    public findOne(@Param() params: FindOneParams):ITask{
        const task = this.taskService.findOne(params.id); 

        if(task){

            return task;
        }
            throw new NotFoundException();

    }

    @Post()
    public create(@Body() createTaskDto: CreateTaskDto){
        return this.taskService.create(createTaskDto);
    }
}
