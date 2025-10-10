import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VendasProdutos } from 'src/core/database/entities/vendas_produtos.entity';

@Injectable()
export class VendasProdutosService {
  constructor(
    @Inject('VENDAS_PRODUTOS_REPOSITORY')
    private vendasProdutosRepository: Repository<VendasProdutos>,
  ) {}

  // 🟢 Retorna todos os itens de todas as vendas
  async findAll(): Promise<VendasProdutos[]> {
    return this.vendasProdutosRepository.find({ relations: ['venda', 'produto'] });
  }

  // 🟢 Retorna um item específico
  async findOne(id: number): Promise<VendasProdutos> {
    const item = await this.vendasProdutosRepository.findOne({
      where: { id },
      relations: ['venda', 'produto'],
    });
    if (!item) throw new NotFoundException('Item da venda não encontrado');
    return item;
  }

  // 🟢 Cria um item na venda
  async create(data: Partial<VendasProdutos>): Promise<VendasProdutos> {
    const item = this.vendasProdutosRepository.create(data);
    return this.vendasProdutosRepository.save(item);
  }

  // 🟢 Atualiza um item da venda
  async update(id: number, data: Partial<VendasProdutos>): Promise<VendasProdutos> {
    const item = await this.findOne(id);
    Object.assign(item, data);
    return this.vendasProdutosRepository.save(item);
  }

  // 🟢 Remove um item da venda
  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.vendasProdutosRepository.remove(item);
  }

  // 🟢 Busca todos os produtos de uma venda específica
  async findByVenda(vendaId: number): Promise<VendasProdutos[]> {
    return this.vendasProdutosRepository.find({
      where: { venda_id: vendaId },
      relations: ['produto'],
    });
  }
}
