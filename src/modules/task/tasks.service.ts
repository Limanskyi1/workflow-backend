import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

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
        priority: priority || 'MEDIUM',
        boardId: boardId,
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
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTask(id: number) {
    const task = await this.prisma.task.delete({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
