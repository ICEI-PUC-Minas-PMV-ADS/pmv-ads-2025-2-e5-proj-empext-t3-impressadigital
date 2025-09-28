import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import { Carrinho } from 'src/core/database/entities/carrinho.entity';

@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Get()
  async findAll(): Promise<Carrinho[]> {
    return this.carrinhoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Carrinho> {
    return this.carrinhoService.findById(id);
  }

  @Post()
  async create(@Body() data: Partial<Carrinho>): Promise<Carrinho> {
    return this.carrinhoService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Carrinho>,
  ): Promise<Carrinho> {
    return this.carrinhoService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.carrinhoService.remove(id);
  }
}
