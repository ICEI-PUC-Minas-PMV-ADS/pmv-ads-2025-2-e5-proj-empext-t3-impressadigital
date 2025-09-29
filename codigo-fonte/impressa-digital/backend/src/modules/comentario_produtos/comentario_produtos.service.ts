import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ComentarioProduto } from 'src/core/database/entities/comentario_produtos.entity';

@Injectable()
export class ComentarioProdutoService {
  constructor(
    @Inject('COMENTARIO_PRODUTO_REPOSITORY')
    private readonly comentarioRepository: Repository<ComentarioProduto>,
  ) {}

  async findAll(): Promise<ComentarioProduto[]> {
    return this.comentarioRepository.find({ relations: ['produto', 'user'] });
  }

  async findOne(id: number): Promise<ComentarioProduto> {
    const comentario = await this.comentarioRepository.findOne({
      where: { id },
      relations: ['produto', 'user'],
    });
    if (!comentario) throw new NotFoundException(`Comentário ${id} não encontrado`);
    return comentario;
  }

  async create(data: Partial<ComentarioProduto>): Promise<ComentarioProduto> {
    const comentario = this.comentarioRepository.create(data);
    return this.comentarioRepository.save(comentario);
  }

  async update(id: number, data: Partial<ComentarioProduto>): Promise<ComentarioProduto> {
    const comentario = await this.findOne(id);
    Object.assign(comentario, data);
    return this.comentarioRepository.save(comentario);
  }

  async remove(id: number): Promise<void> {
    const comentario = await this.findOne(id);
    await this.comentarioRepository.remove(comentario);
  }
}
