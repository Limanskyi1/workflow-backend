import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TasksRepository } from '../repository/tasks.repository';
import { TasksActivityService } from './tasks-activity.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private readonly tasksRepository: TasksRepository,
    private readonly tasksActivityService: TasksActivityService,
  ) {}

  private async getUserBoard(userId: number) {
    const board = await this.prisma.board.findUnique({
      where: { ownerId: userId },
    });

    if (!board) {
      throw new NotFoundException('Board not found for this user');
    }

    return board;
  }

  async create(dto: CreateTaskDto, userId: number) {
    const board = await this.getUserBoard(userId);
    const task = await this.tasksRepository.create({
      ...dto,
      boardId: board.id,
      authorId: userId,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });
    this.tasksActivityService.create(task.id, userId);
    return task;
  }

  async getAll(userId: number, title?: string) {
    return this.tasksRepository.getAll(userId, title);
  }

  async getAllActivities(userId: number) {
    return this.tasksRepository.getAllActivities(userId);
  }

  async deleteAllActivities(userId: number) {
    return this.tasksRepository.deleteAllActivities(userId);
  }

  async getById(id: number) {
    const task = await this.tasksRepository.getById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.tasksRepository.update(id, dto);
    this.tasksActivityService.update(task.id, task.authorId);
    return task;
  }

  async delete(id: number, userId: number) {
    const task = this.tasksRepository.delete(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    this.tasksActivityService.delete(id, userId);
    return task;
  }
}
