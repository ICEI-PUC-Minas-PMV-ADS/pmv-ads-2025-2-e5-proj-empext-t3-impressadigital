// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthDbModule } from '../database/authdb.module';
import { CatalogModule } from './../../modules/catalog/catalog.module';
import { AdmModule } from './../../modules/adm/adm.module';
import { VendasModule } from './../../modules/vendas/vendas.module';
import { MidiasModule } from './../../modules/midias/midias.module';
import { Customer_addressModule } from './../../modules/customer_address/customer_address.module';
import { CarrinhoModule } from './../../modules/carrinho/carrinho.module';
import { CategoryModule } from './../../modules/category/category.module';
import { ProductsModule } from '../../modules/products/products.module';
import { UsersModule } from '../../modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../../modules/auth/auth.module';


@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: false, // apenas em DEV
    }),
    AuthDbModule, // já importa User, Repository, Service, Controller
    CatalogModule,
    AdmModule,
    VendasModule,
    MidiasModule,
    Customer_addressModule,
    CarrinhoModule,
    CategoryModule,
    ProductsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
