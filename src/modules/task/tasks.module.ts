import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TaskActivityListener } from './listeners/task-activity.listener';
import { TasksRepository } from './repository/tasks.repository';
import { TasksActivityService } from './services/tasks-activity.service';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskActivityListener,
    TasksActivityService,
    TasksRepository,
  ],
})
export class TasksModule {}
