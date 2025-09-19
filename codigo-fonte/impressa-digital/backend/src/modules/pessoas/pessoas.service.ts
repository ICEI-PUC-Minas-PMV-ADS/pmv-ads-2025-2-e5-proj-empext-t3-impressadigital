import { Injectable } from '@nestjs/common';
import { PessoasRepository } from './repository/pessoas.repository';
import { Pessoas } from 'src/core/database/entities/pessoas.entity';

@Injectable()
export class PessoasService {
  constructor(private readonly pessoasRepository: PessoasRepository) { }

  async findAll(): Promise<Pessoas[]> {
    return this.pessoasRepository.findAll();
  }


  async findById(pessoa_id: number): Promise<Pessoas | null> {
    return this.pessoasRepository.findById( pessoa_id );
  }

  async create(pessoa: Pessoas): Promise<number> {
    return this.pessoasRepository.create(pessoa);
  }

  async deletebyId(pessoa_id: number): Promise<void> {
    await this.pessoasRepository.deletebyId(pessoa_id);
  } 


}
