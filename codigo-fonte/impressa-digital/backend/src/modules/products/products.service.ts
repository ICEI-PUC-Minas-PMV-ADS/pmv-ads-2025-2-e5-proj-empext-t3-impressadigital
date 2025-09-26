import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Produtos } from '../../core/database/entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUTOS_REPOSITORY')
    private produtosRepository: Repository<Produtos>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       
      .replace(/[^a-z0-9-]/g, ''); 
  }

  findAll(): Promise<Produtos[]> {
    return this.produtosRepository.find({ relations: ['categoria', 'midias'] });
  }

  async findOne(id: number): Promise<Produtos> {
    const produto = await this.produtosRepository.findOne({
      where: { id },
      relations: ['categoria', 'midias'],
    });
    if (!produto) throw new NotFoundException(`Produto ${id} não encontrado`);
    return produto;
  }

  async findBySlug(slug: string): Promise<Produtos> {
    const produto = await this.produtosRepository.findOne({
      where: { slug },
      relations: ['categoria', 'midias'],
    });
    if (!produto) throw new NotFoundException(`Produto com slug "${slug}" não encontrado`);
    return produto;
  }

 async create(data: Partial<Produtos>): Promise<Produtos> {
  if (!data.categoria_id || isNaN(Number(data.categoria_id))) {
    throw new BadRequestException('categoria_id é obrigatório e deve ser um número');
  }

  if (!data.nome) {
    throw new BadRequestException('O nome do produto é obrigatório');
  }

  let slug = this.generateSlug(data.nome);

  let counter = 1;
  let slugExists = await this.produtosRepository.findOneBy({ slug });
  while (slugExists) {
    slug = `${slug}-${counter}`;
    counter++;
    slugExists = await this.produtosRepository.findOneBy({ slug });
  }

  const produto = this.produtosRepository.create({
    ...data,
    categoria_id: Number(data.categoria_id),
    slug,
  });

  return this.produtosRepository.save(produto);
}

  async update(id: number, data: Partial<Produtos>): Promise<Produtos> {
    await this.produtosRepository.update(id, {
      ...data,
      categoria_id: data.categoria_id !== undefined ? Number(data.categoria_id) : undefined,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.produtosRepository.delete(id);
  }
}
