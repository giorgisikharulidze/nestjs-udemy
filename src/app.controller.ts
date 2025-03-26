import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './users/decorator/public.decorator';
import { RedisService } from './redis/redis.service';
import { DummyService } from './dummy/dummy.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly dummyService: DummyService
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  check() {
    return true;
  }

  @Get('/redis')
  @Public()
  getHelloRedis(){
    return this.dummyService.redisTestMethod();
  }
}
