import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CatalogModule } from './../../modules/catalog/catalog.module';
import { CatalogService } from './../../modules/catalog/catalog.service';
import { CatalogController } from './../../modules/catalog/catalog.controller';
import { AdmModule } from './../../modules/adm/adm.module';
import { AdmService } from './../../modules/adm/adm.service';
import { VendasModule } from './../../modules/vendas/vendas.module';
import { PessoasModule } from './../../modules/pessoas/pessoas.module';
import { PessoasService } from './../../modules/pessoas/pessoas.service';
import { PessoasController } from './../../modules/pessoas/pessoas.controller';
import { MidiaService } from './../../modules/midias/midia.service';
import { MidiaController } from './../../modules/midias/midia.controller';
import { MidiasModule } from './../../modules/midias/midias.module';
import { Customer_addressModule } from './../../modules/customer_address/customer_address.module';
import { Customer_addressController } from './../../modules/customer_address/customer_address.controller';
import { CarrinhoModule } from './../../modules/carrinho/carrinho.module';
import { CategoryModule } from './../../modules/category/category.module';
import { ProductsModule } from '../../modules/products/products.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthdbModule } from '../database/authdb.module';


@Module({
  imports: [
    AuthdbModule,
    CatalogModule,
    AdmModule,
    VendasModule,
    PessoasModule, // <-- já importa o módulo que tem o PessoasService + Repository
    MidiasModule,
    Customer_addressModule,
    CarrinhoModule,
    CategoryModule,
    ProductsModule,
  ],
  controllers: [
    CatalogController,
    MidiaController,
    Customer_addressController,
    AppController,
  ],
  providers: [
    CatalogService,
    AdmService,
    MidiaService,
    AppService,
  ],
})
export class AppModule {}
