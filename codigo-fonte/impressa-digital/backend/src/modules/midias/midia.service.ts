import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Midias } from '../../core/database/entities/midias.entity';

@Injectable()
export class MidiasService {
  constructor(
    @Inject('MIDIAS_REPOSITORY')
    private midiasRepository: Repository<Midias>,
  ) {}

  findAll(): Promise<Midias[]> {
    return this.midiasRepository.find({ relations: ['produto'] });
  }

  async findOne(id: number): Promise<Midias> {
    const midia = await this.midiasRepository.findOne({
      where: { id },
      relations: ['produto'],
    });
    if (!midia) throw new NotFoundException(`Mídia ${id} não encontrada`);
    return midia;
  }

  create(data: Partial<Midias>): Promise<Midias> {
    const midia = this.midiasRepository.create(data);
    return this.midiasRepository.save(midia);
  }

  async update(id: number, data: Partial<Midias>): Promise<Midias> {
    await this.midiasRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.midiasRepository.delete(id);
  }
}
