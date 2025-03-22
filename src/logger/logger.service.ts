import { Injectable } from '@nestjs/common';
import { MessageformatterService } from 'src/messageformatter/messageformatter.service';

@Injectable()
export class LoggerService {
  constructor(
    private readonly messageFormatterService: MessageformatterService,
  ) {}

  public log(message: string): string {
    const formattedMessage = this.messageFormatterService.format(message);
    console.log(message);
    return formattedMessage;
  }
}
