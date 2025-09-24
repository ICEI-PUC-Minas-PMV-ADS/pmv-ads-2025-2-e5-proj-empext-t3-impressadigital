import { Comentario_produtosModule } from './../../modules/comentario_produtos/comentario_produtos.module';
import { Comentario_produtosController } from './../../modules/comentario_produtos/comentario_produtos.controller';
import { Avaliacoes_produtosModule } from './../../modules/avaliacoes_produtos/avaliacoes_produtos.module';
import { Avaliacoes_produtosService } from './../../modules/avaliacoes_produtos/avaliacoes_produtos.service';
import { Avaliacoes_produtosController } from './../../modules/avaliacoes_produtos/avaliacoes_produtos.controller';
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
    Comentario_produtosModule,
    Avaliacoes_produtosModule,
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
  controllers: [
    Comentario_produtosController,
    Avaliacoes_produtosController, AppController],
  providers: [
    Avaliacoes_produtosService, AppService],
})
export class AppModule { }
