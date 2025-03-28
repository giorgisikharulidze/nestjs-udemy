import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigService } from './config/services/typed-config.service';
import { Task } from './tasks/entities/task.entity';
import { User } from './users/entities/user.entity';
import { TaskLabel } from './tasks/entities/task-label.entity';
import { PropertyModule } from './property/property.module';
import { Property } from './property/entities/property.entity';
import { PropertyDetails } from './property/entities/property-details.entity';
import { authConfig } from './config/auth.config';
import { UsersModule } from './users/users.module';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './redis/redis.module';
import { EventModule } from './event/event.module';
import { Event } from './event/entities/event.entity';
import { Attendee } from './event/entities/attandee.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        ...configService.get('database'),
        entities: [Task, User, TaskLabel, Property, PropertyDetails, Event, Attendee],
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
    ScheduleModule,
    RedisModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DummyService,
    WinstonLoggerService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
  exports: [WinstonLoggerService]
})
export class AppModule {}
