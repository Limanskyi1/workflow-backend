import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserBoard(userId: number) {
    return this.prisma.board.findUnique({
      where: { ownerId: userId },
    });
  }

  async create(data: Prisma.TaskUncheckedCreateInput) {
    return this.prisma.task.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.task.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }

  async findAllTasks(userId: number, title?: string) {
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

  async findTaskById(id: number) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async findActivities(userId: number) {
    return this.prisma.taskActivity.findMany({ where: { userId } });
  }

  async deleteActivities(userId: number) {
    return this.prisma.taskActivity.deleteMany({ where: { userId } });
  }
}
