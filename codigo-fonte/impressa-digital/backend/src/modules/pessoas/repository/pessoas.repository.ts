
import { Injectable, Inject } from '@nestjs/common';
import { Pessoas } from 'src/core/database/entities/pessoas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PessoasRepository {
  constructor(
    @Inject('PESSOAS_REPOSITORY')
    private pessoasRepository: Repository<Pessoas>,
  ) {}

  async findAll(): Promise<Pessoas[]> {
    return this.pessoasRepository.find();
  }
}
