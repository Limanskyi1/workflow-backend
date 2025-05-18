import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from 'src/common/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async createVerificationCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.emailCode.create({
      data: { email, code, expiresAt },
    });

    await this.mailService.sendVerificationCode(email, code);
  }

  async validateCode(email: string, code: string) {
    const record = await this.prisma.emailCode.findFirst({
      where: { email, code, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw new BadRequestException('Invalid or expired code');

    await this.prisma.emailCode.delete({ where: { id: record.id } });
    return true;
  }
}
