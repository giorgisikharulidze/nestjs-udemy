import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { response } from 'express';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskStatusDto } from './update-task-status.dto';

@Controller('tasks')
export class TasksController {

    constructor(private readonly taskService: TasksService){}
    
    @Get()
    public findAll():ITask[]{
        return this.taskService.findAll()
    }

    @Get('/:id')
    public findOne(@Param() params: FindOneParams):ITask{
     
        return this.findOneOrFail(params.id)

    }

    @Post()
    public create(@Body() createTaskDto: CreateTaskDto){
        return this.taskService.create(createTaskDto);
    }


    @Patch(':id/status')
    public updateTaskStatus(
        @Param() params: FindOneParams,
        @Body() body: UpdateTaskStatusDto
    ): ITask{
        const task = this.findOneOrFail(params.id);
        task.status = body.status;

        return task;

    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public deleteTask(@Param() params: FindOneParams): void {
        const task = this.findOneOrFail(params.id);
        this.taskService.deleteTask(task.id);
    }


    private findOneOrFail(id: string): ITask{
        const task = this.taskService.findOne(id); 

        if(!task){

            throw new NotFoundException();
        }
        return task;
    }
}
