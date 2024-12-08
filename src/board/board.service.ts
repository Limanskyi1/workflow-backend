import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardService {
  constructor(private prisma: PrismaService) {}

  async getBoardByUser(userId: number) {

    let board = await this.prisma.board.findFirst({
      where: { ownerId: userId },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (board) {
      return board;
    }
    
    board = await this.createNewBoard(userId);

    return board;
  }


  async createNewBoard(userId: number) {
    const board = await this.prisma.board.create({
      data: {
        title: 'Default Board',
        ownerId: userId,
        columns: {
          create: [
            { name: 'In Box', status: 'IN_BOX' },
            { name: 'To Do', status: 'TO_DO' },
            { name: 'In Progress', status: 'IN_PROGRESS' },
            { name: 'Waiting', status: 'WAITING' },
            { name: 'In Review', status: 'IN_REVIEW' },
            { name: 'Done', status: 'DONE' },
          ],
        },
      },
      include: {
        columns: {
          include: {
            tasks: true,
          },
        },
      },
    });

    return board;
  }
}
