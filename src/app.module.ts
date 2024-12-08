import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, BoardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
