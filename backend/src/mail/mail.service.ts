import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
}

// Envoi d'emails via nodemailer directement : on n'utilise aucun moteur de template,
// inutile d'embarquer @nestjs-modules/mailer et ses dépendances
@Injectable()
export class MailService {
  private readonly transporter: Transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
  });

  async sendMail(message: MailMessage) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      ...message,
    });
  }
}
