import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private mailService: MailService,
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refresh_token },
    });

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.id, user.email);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refresh_token },
      });

      return tokens;
    } catch (error) {
      this.logger.error('Refresh token validation failed', error.stack);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async registerWithCode(email: string, password: string, name: string) {
    const existingUser = await this.userService.getByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя без isVerified
    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Генерация и отправка кода
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    // Сохраняем код в базе
    await this.prisma.emailCode.create({
      data: { email, code, expiresAt },
    });

    // Отправка кода на email
    await this.mailService.sendVerificationCode(email, code);

    return { message: 'Verification code sent to email' };
  }

  async confirmRegistrationCode(email: string, code: string) {
    const record = await this.prisma.emailCode.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired code');
    }

    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.emailCode.delete({ where: { id: record.id } });

    const tokens = await this.generateTokens(user.id, user.email);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refresh_token },
    });

    return tokens;
  }
}
