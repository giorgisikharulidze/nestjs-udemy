import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { AppConfig } from './config/app.config';
import { TypedConfigService } from './config/typed-config.service';
import { WinstonLoggerService } from './logger/winston-logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly dummyService: DummyService,
    private readonly loggerService: LoggerService,
    private readonly configService: TypedConfigService,
    private readonly logger: WinstonLoggerService,
  ) {}

  getHello() {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    const message = this.configService.get<AppConfig>('app')?.message;
    const messageWinston = `${prefix} Hello World!`; 
    this.logger.log(messageWinston);
/*    this.logger.debug(messageWinston);
    this.logger.verbose(messageWinston);
    this.logger.warn(messageWinston);
    this.logger.error(messageWinston,"trace");
*/
    return  messageWinston;
  }
}
