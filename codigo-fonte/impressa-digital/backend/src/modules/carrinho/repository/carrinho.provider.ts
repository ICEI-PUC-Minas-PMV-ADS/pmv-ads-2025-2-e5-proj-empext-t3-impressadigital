import { Carrinho } from 'src/core/database/entities/carrinho.entity';
import { DataSource } from 'typeorm';

export const carrinhoProviders = [
  {
    provide: 'CARRINHO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Carrinho),
    inject: ['DATA_SOURCE'], // ou DataSource dependendo de como você registrou
  },
];
