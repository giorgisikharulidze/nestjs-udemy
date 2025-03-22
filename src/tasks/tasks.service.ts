import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from './task.model';
import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { TaskLabel } from './task-label.entity';

@Injectable()
export class TasksService {
   
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        @InjectRepository(TaskLabel)
        private readonly labelsRepository: Repository<TaskLabel>
    ){}

    public async findAll(): Promise<Task[]> {
        return await this.taskRepository.find();
    }

    public async findOne(id:string): Promise<Task | null>  {

    return await this.taskRepository.findOne({
        where: {id},
        relations: ['labels'],
    });
    }

    public async createTask(createTaskDto: CreateTaskDto): Promise<Task>{

/*        await this.taskRepository.create({
            
        });
*/
        return await this.taskRepository.save(createTaskDto);

    }


    public async updateTask(
        task: Task, 
        updateTaskDto: UpdateTaskDto
    ): Promise<Task>{
        if(
            updateTaskDto.status && !this.isValideStatusTransition(task.status,updateTaskDto.status)
          ) 
        {
            throw new WrongTaskStatusException(); 
        }
        Object.assign(task,updateTaskDto);
        return  await this.taskRepository.save(task);
    }

    public async  deleteTask(task: Task): Promise<void> {
        await this.taskRepository.delete(task);

    }

    public async addLabels(task: Task, lableDtos: CreateTaskLabelDto[]): 
    Promise<Task>{
        const labels = lableDtos.map(
            (label)=> 
                this.labelsRepository.create(label),
        )
        task.labels = [... task.labels, ...labels];
        return await this.taskRepository.save(task);

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
