import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Avaliacoes_Produto } from 'src/core/database/entities/avaliacoes_produtos.entity';

@Injectable()
export class Avaliacoes_produtosService {
  constructor(
    @Inject('AVALIACOES_PRODUTO_REPOSITORY')
    private readonly avaliacoesRepository: Repository<Avaliacoes_Produto>,
  ) {}

  async create(data: Partial<Avaliacoes_Produto>): Promise<Avaliacoes_Produto> {
    try {
      const novaAvaliacao = this.avaliacoesRepository.create(data);
      return await this.avaliacoesRepository.save(novaAvaliacao);
    } catch (error) {
      throw new BadRequestException('Erro ao criar avaliação');
    }
  }

  async findAll(): Promise<Avaliacoes_Produto[]> {
    return await this.avaliacoesRepository.find({
      relations: ['produto', 'user'], 
    });
  }

  async findByProdutoId(produtoId: number): Promise<Avaliacoes_Produto[]> {
    return await this.avaliacoesRepository.find({
      where: { produto: { id: produtoId } },
      relations: ['produto', 'user'],
    });
  }

  async findById(id: number): Promise<Avaliacoes_Produto> {
    const avaliacao = await this.avaliacoesRepository.findOne({
      where: { id },
      relations: ['produto', 'user'],
    });
    if (!avaliacao) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada`);
    }
    return avaliacao;
  }

  async update(
    id: number,
    data: Partial<Avaliacoes_Produto>,
  ): Promise<Avaliacoes_Produto> {
    const avaliacao = await this.findById(id);
    Object.assign(avaliacao, data);
    return await this.avaliacoesRepository.save(avaliacao);
  }

  async remove(id: number): Promise<void> {
    const avaliacao = await this.findById(id);
    await this.avaliacoesRepository.remove(avaliacao);
  }
}