import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Produtos } from '../../core/database/entities/products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('categoria_id') categoria_id?: string): Promise<Produtos[]> {
    // Converte o valor da query string para número
    const filterId = categoria_id ? parseInt(categoria_id, 10) : undefined;
    return this.productsService.findAll(filterId);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Produtos> {
    return this.productsService.findOne(+id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<Produtos> {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  create(@Body() data: Partial<Produtos>): Promise<Produtos> {
    return this.productsService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Produtos>,
  ): Promise<Produtos> {
    return this.productsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(+id);
  }
}
