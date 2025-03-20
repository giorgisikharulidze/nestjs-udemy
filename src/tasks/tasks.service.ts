import { Injectable } from '@nestjs/common';
import { Itask } from './task.model';

@Injectable()
export class TasksService {
    private tasks: Itask[]= [];
}
