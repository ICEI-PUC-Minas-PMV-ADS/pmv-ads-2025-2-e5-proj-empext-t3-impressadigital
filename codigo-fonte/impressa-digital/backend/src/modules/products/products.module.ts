// products.module.ts
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { productsProviders } from './repository/products.provider';
import { AuthdbModule } from 'src/core/database/authdb.module';

@Module({
  imports: [AuthdbModule],
  providers: [...productsProviders, ProductsService],
  controllers: [ProductsController],
  exports: [...productsProviders],
})
export class ProductsModule {}
