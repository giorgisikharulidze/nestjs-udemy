import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Module({
  imports: [ScheduleModule.forRoot()], // Scheduler-ის მოდული დაყენებულია
  providers: [SchedulerService,WinstonLoggerService],
})
export class SchedulerModule {}
