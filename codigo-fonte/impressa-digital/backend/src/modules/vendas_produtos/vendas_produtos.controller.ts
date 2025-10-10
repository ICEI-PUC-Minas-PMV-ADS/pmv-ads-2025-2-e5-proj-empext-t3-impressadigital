import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { VendasProdutosService } from './vendas_produtos.service';
import { VendasProdutos } from 'src/core/database/entities/vendas_produtos.entity';

@Controller('vendas_produtos')
export class VendasProdutosController {
  constructor(private readonly vendasProdutosService: VendasProdutosService) {}

  @Get()
  async findAll(): Promise<VendasProdutos[]> {
    return this.vendasProdutosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VendasProdutos> {
    return this.vendasProdutosService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<VendasProdutos>): Promise<VendasProdutos> {
    return this.vendasProdutosService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<VendasProdutos>,
  ): Promise<VendasProdutos> {
    return this.vendasProdutosService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.vendasProdutosService.remove(id);
    return { message: `Item da venda ${id} removido com sucesso` };
  }

  // 🟢 Busca todos os produtos de uma venda específica
  @Get('venda/:vendaId')
  async findByVenda(@Param('vendaId', ParseIntPipe) vendaId: number): Promise<VendasProdutos[]> {
    return this.vendasProdutosService.findByVenda(vendaId);
  }
}
