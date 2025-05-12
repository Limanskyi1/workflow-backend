import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TaskActivityEvent } from '../events/task-activity.event';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateTaskDto, userId: number) {
    const { title, description, status, priority, dueDate } = dto;

    const userBoard = await this.prisma.board.findUnique({
      where: { ownerId: userId },
    });

    if (!userBoard) {
      throw new NotFoundException('Board not found for this user');
    }

    const boardId = userBoard.id;

    return this.prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        boardId,
        authorId: userId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });
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
    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
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
