import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Pessoas } from 'src/core/database/entities/pessoas.entity';

@Injectable()
export class PessoasRepository {
  constructor(
    @Inject('PESSOAS_REPOSITORY')
    private readonly pessoasRepository: Repository<Pessoas>,
  ) { }

  async findAll(): Promise<Pessoas[]> {
    return this.pessoasRepository.find();
  }



  async findById(pessoa_id: number): Promise<Pessoas | null>{
    return await this.pessoasRepository.findOneBy( { id: pessoa_id } );
  }


  async create(pessoa: Pessoas): Promise<number> {
    return (await this.pessoasRepository.save(pessoa)).id; 

  }

  async deletebyId(pessoa_id: number): Promise<void> {
    const pessoa = await this.pessoasRepository.findOneBy( { id: pessoa_id } );
    if (!pessoa){ 
      throw new Error('Pessoa não encontrada');
    }
    await this.pessoasRepository.delete(pessoa);
  } 




}
