import { Injectable } from '@nestjs/common';
import { AppConfig } from './config/app.config';
import { TypedConfigService } from './config/services/typed-config.service';
import { WinstonLoggerService } from './logger/winston-logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: TypedConfigService,
    private readonly logger: WinstonLoggerService,
  ) {}

  getHello() {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
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
