import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ComentarioProduto } from 'src/core/database/entities/comentario_produtos.entity';
import { ComentarioProdutoService } from './comentario_produtos.service';

@Controller('comentario_produto')
export class ComentarioProdutoController {
  constructor(private readonly comentarioService: ComentarioProdutoService) {}

  @Get()
  async findAll(): Promise<ComentarioProduto[]> {
    return this.comentarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ComentarioProduto> {
    return this.comentarioService.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<ComentarioProduto>): Promise<ComentarioProduto> {
    return this.comentarioService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<ComentarioProduto>,
  ): Promise<ComentarioProduto> {
    return this.comentarioService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.comentarioService.remove(id);
    return { message: `Comentário ${id} removido com sucesso` };
  }
}
