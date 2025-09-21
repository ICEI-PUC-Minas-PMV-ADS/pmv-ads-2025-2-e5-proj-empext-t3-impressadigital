import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Pessoas } from 'src/core/database/entities/pessoas.entity';

@Injectable()
export class PessoasRepository {
  constructor(
    @Inject('PESSOAS_REPOSITORY')
    private readonly pessoasRepository: Repository<Pessoas>,
  ) {}

  async findAll(): Promise<Pessoas[]> {
    return this.pessoasRepository.find();
  }

  async findById(pessoa_id: number): Promise<Pessoas | null> {
    return this.pessoasRepository.findOneBy({ id: pessoa_id });
  }

  async create(pessoa: Pessoas): Promise<number> {
    const saved = await this.pessoasRepository.save(pessoa);
    return saved.id;
  }

  async deletebyId(pessoa_id: number): Promise<void> {
    const pessoa = await this.pessoasRepository.findOne({
      where: { id: pessoa_id },
      relations: ['enderecos', 'carrinhos', 'vendas'], // garante que os relacionamentos sejam carregados
    });

    if (!pessoa) {
      throw new Error('Pessoa não encontrada');
    }

    await this.pessoasRepository.remove(pessoa); // remove respeitando cascade
  }
}
