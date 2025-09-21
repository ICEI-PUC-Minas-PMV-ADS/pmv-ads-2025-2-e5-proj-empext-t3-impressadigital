import { DataSource } from 'typeorm';
import { Categorias } from '../../../core/database/entities/category.entity';

export const categoryProviders = [
  {
    provide: 'CATEGORY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Categorias),
    inject: ['DATA_SOURCE'],
  },
];