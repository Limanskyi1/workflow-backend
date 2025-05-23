import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { TaskActivityEvent } from '../events/task-activity.event';
import { TasksRepository } from '../repository/tasks.repository';

@Injectable()
export class TaskActivityListener {
  constructor(private readonly tasksRepository: TasksRepository) {}

  @OnEvent('task.delete')
  async handleTaskDeleted(event: TaskActivityEvent) {
    try {
      await this.tasksRepository.createActivity({
        taskId: event.taskId,
        userId: event.userId,
        message: `Task #${event.taskId} was deleted`,
        type: 'DELETE',
      });
    } catch (error) {
      console.error('Error creating task activity', error);
    }
  }
  @OnEvent('task.create')
  async handleTaskCreated(event: TaskActivityEvent) {
    try {
      await this.tasksRepository.createActivity({
        taskId: event.taskId,
        userId: event.userId,
        message: `Task #${event.taskId} was created`,
        type: 'CREATE',
      });
    } catch (error) {
      console.error('Error creating task activity', error);
    }
  }

  @OnEvent('task.update')
  async handleTaskUpdated(event: TaskActivityEvent) {
    try {
      await this.tasksRepository.createActivity({
        taskId: event.taskId,
        userId: event.userId,
        message: `Task #${event.taskId} was updated`,
        type: 'UPDATE',
      });
    } catch (error) {
      console.error('Error creating task activity', error);
    }
  }
}
