import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @UserId() userId: number) {
    return this.tasksService.create(dto, userId);
  }

  @Get()
  async getAll(@UserId() userId: number, @Query('title') title?: string) {
    return this.tasksService.getAll(userId, title);
  }

  @Get('activities')
  async getAllActivities(@UserId() userId: number) {
    return this.tasksService.getAllActivities(userId);
  }

  @Delete('activities')
  async deleteAllActivities(@UserId() userId: number) {
    return this.tasksService.deleteAllActivities(userId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getById(id);
  }

  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
  ) {
    return this.tasksService.delete(id, userId);
  }
}
