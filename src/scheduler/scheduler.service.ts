import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Injectable()
export class SchedulerService {

    constructor(private readonly logger: WinstonLoggerService,
        
    ){}
    
//    @Cron(CronExpression.EVERY_30_SECONDS)
    logEvery30Second(){
        this.logger.log(`Cron job running EVERY_30_SECONDS ${process.env.APP_MESSAGE}`);
    }

}
