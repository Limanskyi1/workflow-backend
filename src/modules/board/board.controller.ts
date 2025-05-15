import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { UpdateBoardDto } from './dto/update-board.dto';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getByUser(@UserId() userId: number) {
    return this.boardService.getByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardService.update(id, dto);
  }
}
