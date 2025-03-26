import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { MessageformatterService } from './messageformatter/messageformatter.service';
import { LoggerService } from './logger/logger.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigService } from './config/typed-config.service';
import { Task } from './tasks/task.entity';
import { User } from './users/user.entity';
import { TaskLabel } from './tasks/task-label.entity';
import { PropertyModule } from './property/property.module';
import { Property } from './property/property.entity';
import { PropertyDetails } from './property/property-details.entity';
import { authConfig } from './config/auth.config';
import { UsersModule } from './users/users.module';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        ...configService.get('database'),
        entities: [Task, User, TaskLabel, Property, PropertyDetails],
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeOrmConfig, authConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        //allowUnknow: false,
        abortEarly: true,
      },
    }),
    TasksModule,
    PropertyModule,
    UsersModule,
    SchedulerModule,
    ScheduleModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DummyService,
    MessageformatterService,
    LoggerService,
    WinstonLoggerService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
  exports: [WinstonLoggerService]
})
export class AppModule {}
