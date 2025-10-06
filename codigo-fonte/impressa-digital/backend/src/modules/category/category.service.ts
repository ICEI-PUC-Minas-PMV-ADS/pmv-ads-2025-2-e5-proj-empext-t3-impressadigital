// category.service.ts
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Categorias } from '../../core/database/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Categorias>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

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

  async create(data: Partial<Categorias>): Promise<Categorias> {
    if (!data.nome) {
      throw new BadRequestException('O nome da categoria é obrigatório');
    }

    let slug = this.generateSlug(data.nome);

    let counter = 1;
    let slugExists = await this.categoryRepository.findOneBy({ slug });
    while (slugExists) {
      slug = `${slug}-${counter}`;
      counter++;
      slugExists = await this.categoryRepository.findOneBy({ slug });
    }

    const categoria = this.categoryRepository.create({
      ...data,
      slug,
    });

    return this.categoryRepository.save(categoria);
  }

  async update(id: number, data: Partial<Categorias>): Promise<Categorias> {
    if (data.nome) {
      let slug = this.generateSlug(data.nome);

      let counter = 1;
      let slugExists = await this.categoryRepository.findOneBy({ slug });
      while (slugExists && slugExists.id !== id) {
        slug = `${slug}-${counter}`;
        counter++;
        slugExists = await this.categoryRepository.findOneBy({ slug });
      }
      
      data.slug = slug;
    }

    await this.categoryRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async findBySlug(slug: string): Promise<Categorias> {
  const categoria = await this.categoryRepository.findOne({
    where: { slug },
    relations: ['produtos'],
  });
  if (!categoria) throw new NotFoundException(`Categoria com slug "${slug}" não encontrada`);
  return categoria;
}
}