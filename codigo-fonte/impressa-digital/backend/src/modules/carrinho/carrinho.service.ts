import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Carrinho } from 'src/core/database/entities/carrinho.entity';

@Injectable()
export class CarrinhoService {
  constructor(
    @Inject('CARRINHO_REPOSITORY')
    private readonly carrinhoRepository: Repository<Carrinho>,
  ) {}

  async create(data: Partial<Carrinho>): Promise<Carrinho> {
    try {
      const novoItem = this.carrinhoRepository.create(data);
      return await this.carrinhoRepository.save(novoItem);
    } catch (error) {
      throw new BadRequestException('Erro ao adicionar item ao carrinho');
    }
  }

  async findAll(): Promise<Carrinho[]> {
    return await this.carrinhoRepository.find();
  }

  async findById(id: number): Promise<Carrinho> {
    const item = await this.carrinhoRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item do carrinho com ID ${id} não encontrado`);
    }
    return item;
  }

  async update(id: number, data: Partial<Carrinho>): Promise<Carrinho> {
    const item = await this.findById(id);
    Object.assign(item, data);
    return await this.carrinhoRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findById(id);
    await this.carrinhoRepository.remove(item);
  }
}
