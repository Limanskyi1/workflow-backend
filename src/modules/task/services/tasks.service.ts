import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskActivityEvent } from '../events/task-activity.event';
import { TasksRepository } from '../repository/tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async create(dto: CreateTaskDto, userId: number) {
    const board = await this.prisma.board.findUnique({
      where: { ownerId: userId },
    });

    if (!board) {
      throw new NotFoundException('Board not found for this user');
    }

    const { title, description, status, priority, dueDate } = dto;

    const task = await this.tasksRepository.create({
      title,
      description,
      status,
      priority,
      boardId: board.id,
      authorId: userId,
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    this.eventEmitter.emit(
      'task.create',
      new TaskActivityEvent(task.id, userId),
    );

    return task;
  }

  async getAll(userId: number, title?: string) {
    return this.prisma.task.findMany({
      where: {
        authorId: userId,
        ...(title && {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        }),
      },
    });
  }

  async getAllActivities(userId: number) {
    return this.prisma.taskActivity.findMany({
      where: {
        userId,
      },
    });
  }

  async deleteAllActivities(userId: number) {
    return this.prisma.taskActivity.deleteMany({
      where: {
        userId,
      },
    });
  }

  async getById(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(id: number, dto: UpdateTaskDto) {
    const task = await this.prisma.task.update({
      where: { id },
      data: dto,
    });

    this.eventEmitter.emit(
      'task.update',
      new TaskActivityEvent(task.id, task.authorId),
    );

    return task;
  }

  async deleteTask(id: number, userId: number) {
    this.eventEmitter.emit('task.delete', new TaskActivityEvent(id, userId));

    const task = await this.prisma.task.delete({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
