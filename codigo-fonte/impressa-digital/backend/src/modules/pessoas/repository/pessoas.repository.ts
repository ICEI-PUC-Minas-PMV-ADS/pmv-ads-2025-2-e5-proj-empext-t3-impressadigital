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
}
