import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { MailService } from 'src/modules/mail/mail.service';
import { EmailVerificationService } from './services/email-verification.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    MailService,
    EmailVerificationService,
    PasswordService,
    TokenService,
  ],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
