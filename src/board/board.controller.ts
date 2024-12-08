import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Get("my")
  async getBoardByUser(@Request() req) {
    const { userId } = req.user;
    return this.boardService.getBoardByUser(userId);
  }
}
