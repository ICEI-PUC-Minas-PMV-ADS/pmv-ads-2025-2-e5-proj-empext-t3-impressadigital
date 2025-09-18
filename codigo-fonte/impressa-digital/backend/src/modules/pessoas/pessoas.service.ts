import { Injectable } from '@nestjs/common';
import { PessoasRepository } from './repository/pessoas.repository';
import { Pessoas } from 'src/core/database/entities/pessoas.entity';

@Injectable()
export class PessoasService {
  constructor(private readonly pessoasRepository: PessoasRepository) {}

  async findAll(): Promise<Pessoas[]> {
    return this.pessoasRepository.findAll();
  }
}
