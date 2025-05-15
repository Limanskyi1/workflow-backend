import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getById(id: number) {
    return this.prisma.board.findUnique({ where: { id } });
  }

  getByUserId(userId: number) {
    return this.prisma.board.findFirst({
      where: {
        ownerId: userId,
      },
    });
  }

  update(id: number, data: any) {
    return this.prisma.board.update({ where: { id }, data });
  }

  createDefault(userId: number) {
    return this.prisma.board.create({
      data: {
        title: 'Default Board',
        ownerId: userId,
      },
    });
  }
}
