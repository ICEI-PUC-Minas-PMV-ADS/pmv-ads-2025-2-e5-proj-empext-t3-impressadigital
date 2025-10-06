import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Categorias } from '../../core/database/entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Categorias[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Categorias> {
    return this.categoryService.findOne(+id);
  }


  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<Categorias> {
    return this.categoryService.findBySlug(slug);
  }

  @Post()
  create(@Body() data: Partial<Categorias>): Promise<Categorias> {
    return this.categoryService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Categorias>): Promise<Categorias> {
    return this.categoryService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(+id);
  }
}
