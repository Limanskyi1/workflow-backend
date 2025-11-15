import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { BoardModule } from './modules/board/board.module';
import { TasksModule } from './modules/task/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './common/mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NoteModule } from './modules/note/note.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    BoardModule,
    TasksModule,
    MailModule,
    EventEmitterModule.forRoot(),
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
