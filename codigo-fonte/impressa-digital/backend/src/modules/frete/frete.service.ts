import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FreteService {
  private readonly URL_PRODUCAO =
    'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';
  private readonly URL_SANDBOX =
    'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate';

  async calcularFrete(cepDestino: string, produtos: any[]) {
    try {
      const token = process.env.MELHOR_ENVIO_TOKEN;
      const sandbox = process.env.MELHOR_ENVIO_SANDBOX === 'true';

      if (!token) {
        throw new Error('Token do Melhor Envio não configurado no .env');
      }

      // Monta o body da requisição
      const body = {
        from: {
          postal_code: process.env.MELHOR_ENVIO_CEP_ORIGEM || '01001000',
        },
        to: { postal_code: cepDestino },
        products: produtos.map((produto, i) => ({
          id: `prod_${i}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          width: produto.width,
          height: produto.height,
          length: produto.length,
          weight: produto.weight,
          quantity: produto.quantity,
          
        })),
      };

      const url = sandbox ? this.URL_SANDBOX : this.URL_PRODUCAO;

      console.log('📦 Calculando frete...');
      console.log('🔹 URL:', url);
      console.log('🔹 Sandbox ativo?', sandbox);
      console.log('🔹 Token presente?', !!token);
      console.log('🔹 Body enviado:', body);

      const response = await axios.post(url, body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'User-Agent': 'Aplicacao (email@dominio.com)',
        },
        timeout: 15000,
      });

      console.log('✅ Frete calculado com sucesso:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Erro na API Melhor Envio:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          `Erro ${error.response?.status} na API Melhor Envio`;

        throw new InternalServerErrorException(errorMessage);
      }

      console.error('❌ Erro inesperado:', error.message);
      throw new InternalServerErrorException(
        error.message || 'Falha ao calcular frete',
      );
    }
  }
}
