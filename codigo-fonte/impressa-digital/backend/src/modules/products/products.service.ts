import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
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

  findAll(categoria_id?: number): Promise<Produtos[]> {
    const findOptions: FindManyOptions<Produtos> = {
      relations: ['categoria', 'midias'],
    };

    if (categoria_id !== undefined) {
      findOptions.where = { categoria_id };
    }

    return this.produtosRepository.find(findOptions);
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
    const produto = await this.produtosRepository
      .createQueryBuilder('produto')
      .leftJoinAndSelect('produto.categoria', 'categoria')
      .leftJoinAndSelect('produto.midias', 'midias')
      .where('produto.slug = :slug', { slug })
      .select([
        'produto.id',
        'produto.nome',
        'produto.descricao',
        'produto.preco',
        'produto.slug',
        'produto.status',
        'produto.peso',
        'produto.largura',
        'produto.altura',
        'produto.comprimento',
        'categoria.id',
        'categoria.nome',
        'midias.id',
        'midias.url',
      ])
      .getOne();

    if (!produto)
      throw new NotFoundException(`Produto com slug "${slug}" não encontrado`);

    return produto;
  }

  async create(data: Partial<Produtos>): Promise<Produtos> {
    // validações
    if (!data.categoria_id || isNaN(Number(data.categoria_id))) {
      throw new BadRequestException(
        'categoria_id é obrigatório e deve ser um número',
      );
    }

    if (!data.nome) {
      throw new BadRequestException('O nome do produto é obrigatório');
    }

    const requiredFields = ['peso', 'largura', 'altura', 'comprimento'];
    for (const field of requiredFields) {
      if (!data[field] || Number(data[field]) <= 0) {
        throw new BadRequestException(
          `O campo "${field}" é obrigatório e deve ser maior que 0.`,
        );
      }
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
      peso: Number(data.peso),
      largura: Number(data.largura),
      altura: Number(data.altura),
      comprimento: Number(data.comprimento),
      slug,
    });

    return this.produtosRepository.save(produto);
  }

  async update(id: number, data: Partial<Produtos>): Promise<Produtos> {
    await this.produtosRepository.update(id, {
      ...data,
      categoria_id:
        data.categoria_id !== undefined ? Number(data.categoria_id) : undefined,
      peso: data.peso !== undefined ? Number(data.peso) : undefined,
      largura: data.largura !== undefined ? Number(data.largura) : undefined,
      altura: data.altura !== undefined ? Number(data.altura) : undefined,
      comprimento:
        data.comprimento !== undefined ? Number(data.comprimento) : undefined,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.produtosRepository.delete(id);
  }
}