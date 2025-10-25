
import { Injectable, Inject, NotFoundException, BadRequestException, } from '@nestjs/common';
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

async findAll(): Promise<Vendas[]> {
  const rep = await this.vendasRepository.find({
    relations: ['user', 'user.enderecos'],
  });
  return rep;
}

 
async findById(id: number): Promise<Vendas> {
  const venda = await this.vendasRepository.findOne({ 
    where: { id },
    relations: ['user', 'user.enderecos'],
  });
  if (!venda) {
    throw new NotFoundException(`Venda com ID ${id} não encontrada`);
  }
  return venda;
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