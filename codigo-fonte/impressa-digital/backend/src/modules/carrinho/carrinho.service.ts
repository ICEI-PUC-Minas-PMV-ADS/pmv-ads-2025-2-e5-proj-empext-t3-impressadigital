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
    const { produto_id, user_id, quantidade = 1 } = data;
    
    if (!produto_id || !user_id) {
        throw new BadRequestException('Produto ID e User ID são obrigatórios.');
    }

    try {
      // 1. Verificar se o item já existe para este usuário
      const itemExistente = await this.carrinhoRepository.findOne({
        where: { produto_id, user_id },
      });

      if (itemExistente) {
        // 2. Se existe, apenas ATUALIZA a quantidade
        itemExistente.quantidade += quantidade;
        return await this.carrinhoRepository.save(itemExistente);
      } else {
        // 3. Se não existe, CRIA um novo item
        const novoItem = this.carrinhoRepository.create({
            produto_id,
            user_id,
            quantidade,
        });
        return await this.carrinhoRepository.save(novoItem);
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao adicionar ou atualizar item no carrinho');
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
    // Garante que a quantidade seja tratada como número
    if (data.quantidade !== undefined) {
        data.quantidade = Number(data.quantidade);
    }
    Object.assign(item, data);
    return await this.carrinhoRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findById(id);
    await this.carrinhoRepository.remove(item);
  }
}