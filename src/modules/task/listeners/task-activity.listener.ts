import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TaskActivityEvent } from '../events/task-activity.event';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskActivityListener {
  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('task.delete')
  async handleTaskDeleted(event: TaskActivityEvent) {
    try {
      await this.prisma.taskActivity.create({
        data: {
          taskId: event.taskId,
          userId: event.userId,
          message: `Task #${event.taskId} was deleted`,
          type: 'DELETE',
        },
      });
    } catch (error) {
      console.error('Error creating task activity', error);
    }
  }
}
