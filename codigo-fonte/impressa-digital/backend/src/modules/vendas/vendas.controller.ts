import {Controller,Get,Post,Put,Delete,Param,Body,ParseIntPipe}
from '@nestjs/common';
import { VendasService } from './vendas.service';
import { Vendas } from 'src/core/database/entities/vendas.entity';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  // Criar nova venda
  @Post()
  async create(@Body() data: Partial<Vendas>): Promise<Vendas> {
    return await this.vendasService.create(data);
  }

  // Listar todas as vendas
  @Get()
  async findAll(): Promise<Vendas[]> {
    return await this.vendasService.findAll();
  }

  // Buscar venda por ID
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Vendas> {
    return await this.vendasService.findById(id);
  }

  // Atualizar venda por ID
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() data: Partial<Vendas>
  ): Promise<Vendas> {
    return await this.vendasService.update(id, data);
  }

  // Deletar venda por ID
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.vendasService.remove(id);
    return { message: `Venda com ID ${id} removida com sucesso` };
  }
}
