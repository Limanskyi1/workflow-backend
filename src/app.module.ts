import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { TasksModule } from './task/tasks.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, BoardModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
