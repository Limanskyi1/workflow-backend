import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BoardsRepository } from './repository/boards.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BoardController],
  providers: [BoardService, BoardsRepository],
})
export class BoardModule {}
