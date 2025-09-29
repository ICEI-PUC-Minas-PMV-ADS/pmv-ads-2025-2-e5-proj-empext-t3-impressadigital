import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { Catalogos } from 'src/core/database/entities/catalogo.entity';
import { CatalogoService } from './catalogo.service';

@Controller('catalogo')
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  // Buscar todos os catálogos
  @Get()
  async findAll(): Promise<Catalogos[]> {
    return this.catalogoService.findAll();
  }

  // Buscar catálogo por ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Catalogos> {
    const catalogo = await this.catalogoService.findOne(id);
    if (!catalogo) {
      throw new NotFoundException(`Catálogo ${id} não encontrado`);
    }
    return catalogo;
  }

  // Criar catálogo
  @Post()
  async create(@Body() data: Partial<Catalogos>): Promise<Catalogos> {
    return this.catalogoService.create(data);
  }

  // Atualizar catálogo
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<Catalogos>,
  ): Promise<Catalogos> {
    return this.catalogoService.update(id, data); // Se não existir, service já lança NotFoundException
  }

  // Remover catálogo
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.catalogoService.remove(id);
    return { message: `Catálogo ${id} removido com sucesso` };
  }
}
