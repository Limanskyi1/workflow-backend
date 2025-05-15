import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.TaskUncheckedCreateInput) {
    return this.prisma.task.create({ data });
  }

  createActivity(data: Prisma.TaskActivityUncheckedCreateInput) {
    return this.prisma.taskActivity.create({ data });
  }

  update(id: number, data: UpdateTaskDto) {
    return this.prisma.task.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }

  getById(id: number) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  getAll(userId: number, title?: string) {
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

  getAllActivities(userId: number) {
    return this.prisma.taskActivity.findMany({ where: { userId } });
  }

  deleteAllActivities(userId: number) {
    return this.prisma.taskActivity.deleteMany({ where: { userId } });
  }
}
