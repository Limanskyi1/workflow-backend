import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { EmailVerificationService } from './services/email-verification.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private tokenService: TokenService,
    private passwordService: PasswordService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  async registerWithCode(email: string, password: string, name: string) {
    const existingUser = await this.userService.getByEmail(email);
    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = await this.passwordService.hashPassword(password);

    await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    await this.emailVerificationService.createVerificationCode(email);

    return { message: 'Verification code sent to email' };
  }

  async confirmRegistrationCode(email: string, code: string) {
    await this.emailVerificationService.validateCode(email, code);
    const user = await this.userService.getByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const tokens = this.tokenService.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async login(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const isValid = await this.passwordService.comparePassword(
      password,
      user.password,
    );
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.tokenService.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = this.tokenService.generateTokens(user.id, user.email);
      await this.saveRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async saveRefreshToken(userId: number, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }
}
