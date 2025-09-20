import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryProviders } from './repository/category.provider';
import { AuthdbModule } from '../../core/database/authdb.module';

@Module({
  imports: [AuthdbModule],
  providers: [...categoryProviders, CategoryService],
  controllers: [CategoryController],
  exports: [...categoryProviders],
})
export class CategoryModule {}