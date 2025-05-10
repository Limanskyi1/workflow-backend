import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { BoardModule } from './modules/board/board.module';
import { TasksModule } from './modules/task/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    BoardModule,
    TasksModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
