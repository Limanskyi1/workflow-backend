import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskActivityEvent } from '../events/task-activity.event';

@Injectable()
export class TasksActivityService {
  constructor(private eventEmitter: EventEmitter2) {}

  private emit(event: string, taskId: number, userId: number) {
    this.eventEmitter.emit(event, new TaskActivityEvent(taskId, userId));
  }

  create(taskId: number, userId: number) {
    this.emit('task.create', taskId, userId);
  }

  update(taskId: number, userId: number) {
    this.emit('task.update', taskId, userId);
  }

  delete(taskId: number, userId: number) {
    this.emit('task.delete', taskId, userId);
  }
}
