import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, 
      secure: true, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('Erro ao conectar no SMTP do Gmail', error);
      } else {
        this.logger.log('SMTP do Gmail pronto para enviar e-mails');
      }
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset_password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"Suporte do Site" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Recuperação de senha',
        html: `
          <p>Você solicitou redefinição de senha.</p>
          <p>Clique no link abaixo para redefinir sua senha (válido por 1 hora):</p>
          <a href="${resetUrl}">${resetUrl}</a>
        `,
      });

      this.logger.log(`E-mail de redefinição enviado para: ${email}`);
    } catch (err) {
      this.logger.error('Erro ao enviar e-mail:', err);
      throw err;
    }
  }
}
