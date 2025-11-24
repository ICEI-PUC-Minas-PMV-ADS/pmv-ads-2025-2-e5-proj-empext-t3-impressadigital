import { Injectable, Logger } from '@nestjs/common';
import ElasticEmail from 'elasticemail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly client;

  constructor() {
    this.client = ElasticEmail.initialize({
      apiKey: process.env.ELASTIC_API_KEY,
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset_password?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                
                <tr>
                  <td align="center" style="background-color: #ffffff; padding: 30px 20px; border-bottom: 1px solid #eeeeee;">
                    <img src="https://res.cloudinary.com/ditjrii3d/image/upload/v1761181953/logo_impressa_digital_ggijo1.png" alt="Impressa Digital Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto;">
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px; text-align: center; color: #333333;">
                    <h2 style="color: #1a1a1a; margin-bottom: 30px;">Solicitação de Redefinição de Senha</h2>
                    
                    <p style="font-size: 16px; margin-bottom: 25px;">
                      Você solicitou a redefinição da sua senha. Estamos aqui para ajudar!
                    </p>
                    <p style="font-size: 16px; margin-bottom: 35px;">
                      Clique no botão abaixo para criar uma nova senha.
                    </p>

                    <a href="${resetUrl}" 
                      style="display: inline-block; padding: 12px 25px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; transition: background-color 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                      REDEFINIR SENHA
                    </a>

                    <p style="font-size: 14px; color: #777777; margin-top: 35px;">
                      O link é <strong>válido por 1 hora</strong> e expira após esse período.
                      <br>
                      Se o botão não funcionar, clique aqui: 
                      <a href="${resetUrl}" style="color: #4CAF50; word-break: break-all;">${resetUrl}</a>
                    </p>
                    
                    <p style="font-size: 14px; color: #777777; border-top: 1px solid #eeeeee; padding-top: 20px; margin-top: 20px;">
                      <strong>Se você NÃO solicitou esta alteração, por favor, ignore este e-mail.</strong> Sua senha atual permanecerá a mesma.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="background-color: #2e7d32; padding: 15px 30px; color: #ffffff;">
                    <p style="margin: 0; font-size: 12px;">Se tiver dúvidas, entre em contato com o nosso suporte.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    try {
      const result = await this.client.emails.send({
        recipients: [email],
        content: {
          from: process.env.MAIL_FROM,
          subject: 'Recuperação de Senha - Impressa Digital',
          bodyHtml: html,
        },
      });

      this.logger.log(`E-mail enviado para ${email}`);
      return result;
    } catch (err) {
      this.logger.error('Erro ao enviar email:', err);
      throw err;
    }
  }
}
