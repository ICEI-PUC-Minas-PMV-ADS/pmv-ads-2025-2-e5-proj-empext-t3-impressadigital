import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Avaliacoes_produtosService } from './avaliacoes_produtos.service';
import { Avaliacoes_Produto } from 'src/core/database/entities/avaliacoes_produtos.entity';

@Controller('avaliacoes_produto')
export class Avaliacoes_produtosController {
  constructor(private readonly avaliacoesService: Avaliacoes_produtosService) {}

  @Get() async findAll(): Promise<Avaliacoes_Produto[]> {
    return this.avaliacoesService.findAll();
  }

  @Get('produto/:produtoId') async findByProdutoId(
    @Param('produtoId', ParseIntPipe) produtoId: number,
  ): Promise<Avaliacoes_Produto[]> {
    return this.avaliacoesService.findByProdutoId(produtoId);
  }

  @Get('search') async findByProdutoQuery(
    @Query('produtoId', ParseIntPipe) produtoId: number,
  ): Promise<Avaliacoes_Produto[]> {
    return this.avaliacoesService.findByProdutoId(produtoId);
  }

  @Get(':id') async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Avaliacoes_Produto> {
    return this.avaliacoesService.findById(id);
  }

  @Post() async create(
    @Body() data: Partial<Avaliacoes_Produto>,
  ): Promise<Avaliacoes_Produto> {
    return this.avaliacoesService.create(data);
  }

  @Put(':id') async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Avaliacoes_Produto>,
  ): Promise<Avaliacoes_Produto> {
    return this.avaliacoesService.update(id, data);
  }

  @Delete(':id') async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.avaliacoesService.remove(id);
  }
}