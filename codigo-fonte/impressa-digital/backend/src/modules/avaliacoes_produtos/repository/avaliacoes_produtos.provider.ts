import { DataSource } from 'typeorm';
import { Avaliacoes_Produto } from 'src/core/database/entities/avaliacoes_produtos.entity';

export const Avaliacoes_ProdutoProviders = [
  {
    provide: 'AVALIACOES_PRODUTO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Avaliacoes_Produto),
    inject: ['DATA_SOURCE'], // ou DataSource dependendo de como você registrou
  },
];
