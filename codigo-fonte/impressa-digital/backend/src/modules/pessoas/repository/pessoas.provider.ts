// src/modules/pessoas/repository/pessoas.provider.ts
import { Pessoas } from 'src/core/database/entities/pessoas.entity';
import { DataSource } from 'typeorm';

export const pessoasProviders = [
  {
    provide: 'PESSOAS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Pessoas),
    inject: ['DATA_SOURCE'], // 👈 mesmo token definido no authdbProviders
  },
];
