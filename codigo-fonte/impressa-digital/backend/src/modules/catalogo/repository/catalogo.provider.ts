import { Catalogos } from 'src/core/database/entities/catalogo.entity';
import { DataSource } from 'typeorm';

export const catalogoProviders = [
  {
    provide: 'CATALOGO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Catalogos),
    inject: ['DATA_SOURCE'], // ou DataSource dependendo de como você registrou
  },
];
