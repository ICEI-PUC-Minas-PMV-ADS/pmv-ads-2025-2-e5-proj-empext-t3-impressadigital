import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiUrl = 'https://api.elasticemail.com/v4/emails/transactional';

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
                    <img src="https://res.cloudinary.com/ditjrii3d/image/upload/v1761181953/logo_impressa_digital_ggijo1.png" alt="Impressa Digital Logo" style="max-width: 150px;">
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px; text-align: center; color: #333333;">
                    <h2 style="margin-bottom: 30px;">Solicitação de Redefinição de Senha</h2>
                    
                    <p style="margin-bottom: 25px;">
                      Você solicitou a redefinição da sua senha.
                    </p>

                    <a href="${resetUrl}" 
                      style="display: inline-block; padding: 12px 25px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      REDEFINIR SENHA
                    </a>

                    <p style="margin-top: 35px; color: #777777;">
                      Caso o botão não funcione, acesse:<br>
                      <a href="${resetUrl}">${resetUrl}</a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="background-color: #2e7d32; padding: 15px; color: #ffffff;">
                    <p style="margin: 0; font-size: 12px;">Se tiver dúvidas, entre em contato com o nosso suporte.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    const data = {
      Recipients: [
        {
          Email: email,
        },
      ],
      Content: {
        From: process.env.MAIL_FROM,
        Subject: 'Recuperação de Senha - Impressa Digital',
        Body: [
          {
            ContentType: 'HTML',
            Content: html,
            Charset: 'utf-8',
          },
        ],
      },
    };

    try {
      const response = await axios.post(this.apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          'X-ElasticEmail-ApiKey': process.env.ELASTIC_API_KEY,
        },
      });

      this.logger.log(`Email de redefinição enviado com sucesso para ${email}`);
      return response.data;
    } catch (error) {

      if (axios.isAxiosError(error)) {
        this.logger.error(
          `Erro na API ElasticEmail: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`
        );
      } else {
        this.logger.error('Erro desconhecido ao enviar email:', error);
      }
      throw error;
    }
  }
}