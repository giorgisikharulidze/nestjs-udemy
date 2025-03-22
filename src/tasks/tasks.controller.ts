import {  BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './create-task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Task } from './task.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';

@Controller('tasks')
export class TasksController {

    constructor(private readonly taskService: TasksService){}
    
    @Get()
    public async findAll(): Promise<Task[]>{
        return await this.taskService.findAll();
    }

    @Get('/:id')
    public async findOne(@Param() params: FindOneParams): Promise<Task>{
     
        return await this.findOneOrFail(params.id);

    }

    @Post()
    public async create(@Body() createTaskDto: CreateTaskDto): Promise<Task>{
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
    public  async updateTask(
        @Param() params: FindOneParams,
        @Body() updateTaskDto: UpdateTaskDto
    ): Promise<Task>{
        const task = await this.findOneOrFail(params.id);
        try{

            return await this.taskService.updateTask(task,updateTaskDto);
         }
        catch(error){
            if(error instanceof WrongTaskStatusException){
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
        @Body() labels: CreateTaskLabelDto[]
    ):Promise<Task>{
        const task = await this.findOneOrFail(params.id);

        return await this.taskService.addLabels(task, labels);
    }

    private async findOneOrFail(id: string): Promise<Task>{
        const task = await this.taskService.findOne(id); 

        if(!task){

            throw new NotFoundException();
        }
        return await task;
    }
}
