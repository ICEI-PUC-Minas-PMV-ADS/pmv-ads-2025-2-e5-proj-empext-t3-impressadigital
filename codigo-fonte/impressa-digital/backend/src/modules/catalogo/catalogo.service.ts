import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Catalogos } from 'src/core/database/entities/catalogo.entity';

@Injectable()
export class CatalogoService {
  constructor(
    @Inject('CATALOGO_REPOSITORY')
    private readonly catalogRepository: Repository<Catalogos>,
  ) {}

  async findAll(): Promise<Catalogos[]> {
    return this.catalogRepository.find();
  }

  async findOne(id: number): Promise<Catalogos> {
    const catalogo = await this.catalogRepository.findOne({ where: { id } });
    if (!catalogo) {
      throw new NotFoundException(`Catálogo ${id} não encontrado`);
    }
    return catalogo; // ✅ agora sempre retorna Catalogos
  }

  async create(data: Partial<Catalogos>): Promise<Catalogos> {
    const catalogo = this.catalogRepository.create(data);
    return this.catalogRepository.save(catalogo);
  }

  async update(id: number, data: Partial<Catalogos>): Promise<Catalogos> {
    const catalogo = await this.findOne(id); // já garante NotFoundException se não existir
    Object.assign(catalogo, data);
    return this.catalogRepository.save(catalogo);
  }

  async remove(id: number): Promise<void> {
    const catalogo = await this.findOne(id); // já garante NotFoundException se não existir
    await this.catalogRepository.remove(catalogo);
  }
}
