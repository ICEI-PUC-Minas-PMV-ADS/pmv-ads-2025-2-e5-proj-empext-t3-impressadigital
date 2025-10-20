import { Vendas } from 'src/core/database/entities/vendas.entity';
import { DataSource } from 'typeorm';


export const vendasProviders = [
  {
    provide: 'VENDAS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Vendas),
    inject: ['DATA_SOURCE'],
  },
];
