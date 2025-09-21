import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Categorias } from '../../core/database/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Categorias>,
  ) {}

  findAll(): Promise<Categorias[]> {
    return this.categoryRepository.find({ relations: ['produtos'] });
  }

  async findOne(id: number): Promise<Categorias> {
    const categoria = await this.categoryRepository.findOne({
      where: { id },
      relations: ['produtos'],
    });
    if (!categoria) throw new NotFoundException(`Categoria ${id} não encontrada`);
    return categoria;
  }

  create(data: Partial<Categorias>): Promise<Categorias> {
    const categoria = this.categoryRepository.create(data);
    return this.categoryRepository.save(categoria);
  }

  async update(id: number, data: Partial<Categorias>): Promise<Categorias> {
    await this.categoryRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
