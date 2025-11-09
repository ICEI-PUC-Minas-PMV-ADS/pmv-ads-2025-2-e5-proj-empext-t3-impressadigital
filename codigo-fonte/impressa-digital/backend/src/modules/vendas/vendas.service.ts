import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Vendas } from 'src/core/database/entities/vendas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VendasService {
  constructor(
    @Inject('VENDAS_REPOSITORY')
    private vendasRepository: Repository<Vendas>,
  ) {}

  async create(data: Partial<Vendas>): Promise<Vendas> {
    try {
      const novaVenda = this.vendasRepository.create(data);
      return await this.vendasRepository.save(novaVenda);
    } catch (error) {
      throw new BadRequestException('Erro ao criar venda');
    }
  }

  // 🟢 MÉTODO ATUALIZADO: Busca vendas por user_id
  async findByUserId(userId: number): Promise<any[]> {
    const vendas = await this.vendasRepository.find({
      where: { user_id: userId },
      relations: ['user', 'user.enderecos'],
      order: { data_venda: 'DESC' }, // Ordena por data mais recente
    });

    return vendas.map((venda) => ({
      ...venda,
      user: {
        ...venda.user,
        endereco: venda.user.enderecos?.[0] || null,
      },
    }));
  }

  // 🟢 MÉTODO ATUALIZADO: Busca TODAS as vendas (apenas para admin)
  async findAll(): Promise<any[]> {
    const vendas = await this.vendasRepository.find({
      relations: ['user', 'user.enderecos'],
      order: { data_venda: 'DESC' },
    });

    return vendas.map((venda) => ({
      ...venda,
      user: {
        ...venda.user,
        endereco: venda.user.enderecos?.[0] || null,
      },
    }));
  }
 
  async findById(id: number): Promise<Vendas> {
    const venda = await this.vendasRepository.findOne({
      where: { id },
      relations: ['user', 'user.enderecos'],
    });

    if (!venda) throw new NotFoundException(`Venda com ID ${id} não encontrada`);

    return {
      ...venda,
      user: {
        ...venda.user,
        endereco: venda.user.enderecos?.[0] || null,
      },
    } as Vendas;
  }

  async update(id: number, data: Partial<Vendas>): Promise<Vendas> {
    const venda = await this.findById(id);
    Object.assign(venda, data);
    return await this.vendasRepository.save(venda);
  }

  async remove(id: number): Promise<void> {
    const venda = await this.findById(id);
    await this.vendasRepository.remove(venda);
  }
}