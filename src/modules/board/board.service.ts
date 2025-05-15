import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardsRepository } from './repository/boards.repository';

@Injectable()
export class BoardService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  async createDefault(userId: number) {
    const board = await this.boardsRepository.createDefault(userId);
    return board;
  }

  async getByUser(userId: number) {
    const board = await this.boardsRepository.getByUserId(userId);
    if (board) {
      return board;
    }
    const defaultBoard = await this.createDefault(userId);
    return defaultBoard;
  }

  async getById(id: number) {
    const board = await this.boardsRepository.getById(id);
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return board;
  }

  async update(id: number, dto: UpdateBoardDto) {
    const board = await this.boardsRepository.getById(id);
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return this.boardsRepository.update(id, dto);
  }
}
