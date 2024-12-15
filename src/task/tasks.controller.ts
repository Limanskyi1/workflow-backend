import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
  async getAll() {
    return this.tasksService.getAll();
  }


  @Get(":id")
  async getById(@Param('id',ParseIntPipe) id: number) {
    return this.tasksService.getById(id);
  }

  @Patch(":id")
  async updateTask(@Param('id',ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(id, dto);
  }

  
  @Delete(":id")
  async deleteTask(@Param('id',ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
