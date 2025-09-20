import { DataSource } from 'typeorm';
import { Produtos } from '../../../core/database/entities/products.entity';

export const productsProviders = [
  {
    provide: 'PRODUTOS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Produtos),
    inject: ['DATA_SOURCE'],
  },
];
