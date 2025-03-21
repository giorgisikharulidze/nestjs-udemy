import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/config.types';
import { AppConfig } from './config/app.config';

@Injectable()
export class AppService {

  constructor  ( 
     private readonly dummyService: DummyService,
     private readonly loggerService: LoggerService,
     private readonly configService: ConfigService<ConfigType>,
    ){}

  getHello() {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    const message = this.configService.get<AppConfig>('app')?.message;
    return `${this.loggerService.log(
      `${prefix} Hello World! ${this.dummyService.work()}`
    )} ${message}`;
  }
}
