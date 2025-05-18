import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    try {
      const info = {
        from: `"Workflow" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
      };
      await this.transporter.sendMail(info);
    } catch (error) {
      throw error;
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const message = `Your verification code is ${code} expires in 10 minutes`;
    await this.sendMail(email, 'Verification Code', message);
  }
}
