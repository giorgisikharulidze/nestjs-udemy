import { Injectable } from '@nestjs/common';
import { MessageformatterService } from '../messageformatter/services/messageformatter.service';

@Injectable()
export class LoggerService {
  constructor(
    private readonly messageFormatterService: MessageformatterService,
  ) {}

  public log(message: string): string {
    const formattedMessage = this.messageFormatterService.format(message);
    return formattedMessage;
  }
}
