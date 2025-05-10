import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // или другой SMTP-сервис
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"No Reply" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw error;
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const message = `Ваш код подтверждения: ${code}\nОн действителен в течение 10 минут.`;
    await this.sendMail(email, 'Код подтверждения', message);
  }
}
