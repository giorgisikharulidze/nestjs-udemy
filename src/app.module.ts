import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { MessageformatterService } from './messageformatter/messageformatter.service';
import { LoggerService } from './logger/logger.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DummyService, MessageformatterService, LoggerService],
})
export class AppModule {}
