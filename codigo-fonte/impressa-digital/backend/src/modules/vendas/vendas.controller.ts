import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
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

  // 🟢 ROTA ATUALIZADA: Listar vendas com filtro por usuário
  @Get()
  async findAll(@Query('user_id') user_id?: string): Promise<Vendas[]> {
    if (user_id) {
      const userId = parseInt(user_id, 10);
      return await this.vendasService.findByUserId(userId);
    }
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