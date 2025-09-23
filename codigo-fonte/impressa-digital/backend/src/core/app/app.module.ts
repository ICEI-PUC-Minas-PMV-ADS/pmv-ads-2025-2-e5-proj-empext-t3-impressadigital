// app.module.ts
import { Module } from '@nestjs/common';


import { CatalogModule } from './../../modules/catalog/catalog.module';
import { AdmModule } from './../../modules/adm/adm.module';
import { VendasModule } from './../../modules/vendas/vendas.module';
import { MidiasModule } from './../../modules/midias/midias.module';
import { Customer_addressModule } from './../../modules/customer_address/customer_address.module';
import { CarrinhoModule } from './../../modules/carrinho/carrinho.module';
import { CategoryModule } from './../../modules/category/category.module';
import { ProductsModule } from '../../modules/products/products.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../database/auth/auth.module';
import { AuthdbModule } from '../database/authdb.module';



@Module({
  imports: [
    AuthModule,
    AuthdbModule,
    CatalogModule,
    AdmModule,
    VendasModule,
    MidiasModule,
    Customer_addressModule,
    CarrinhoModule,
    CategoryModule,
    ProductsModule
    
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
