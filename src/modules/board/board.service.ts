import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async getByUser(userId: number) {
    let board = await this.prisma.board.findFirst({
      where: { ownerId: userId },
    });

    if (board) {
      return board;
    }

    board = await this.createNew(userId);

    return board;
  }

  async getById(id: number) {
    const board = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async update(id: number, dto: UpdateBoardDto) {
    const board = await this.prisma.board.findUnique({ where: { id } });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return this.prisma.board.update({
      where: { id },
      data: dto,
    });
  }

  async createNew(userId: number) {
    const board = await this.prisma.board.create({
      data: {
        title: 'Default Board',
        ownerId: userId,
      },
    });

    return board;
  }
}
