import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DummyService {

    constructor(private readonly redisService: RedisService,
        private readonly logger: WinstonLoggerService,
    ) {}

    public work(): string{
     return 'Work done';    
    }

    async redisTestMethod() {
        // მონაცემების სერვერზე შენახვა
        await this.redisService.set('testKey', 'testValue', 300000);
    
        // მონაცემების აღება Redis-დან
        const value = await this.redisService.get<string>('testKey');  // ტიპიზაცია string-ს
        return this.logger.log(value ?? '');  // თუ მონაცემი ვერ მოიძებნა, დაბეჭდავს ცარიელს
      }
 
}
