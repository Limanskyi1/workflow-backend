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
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @Request() req) {
    const { userId } = req.user;
    return this.tasksService.create(dto, userId);
  }

  @Get()
  async getAll(@Request() req, @Query('title') title?: string) {
    const { userId } = req.user;
    return this.tasksService.getAll(userId, title);
  }

  @Get('activities')
  async getAllActivities(@Request() req) {
    const { userId } = req.user;
    return this.tasksService.getAllActivities(userId);
  }

  @Delete('activities')
  async deleteAllActivities(@Request() req) {
    const { userId } = req.user;
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
    return this.tasksService.updateTask(id, dto);
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const { userId } = req.user;
    return this.tasksService.deleteTask(id, userId);
  }
}
