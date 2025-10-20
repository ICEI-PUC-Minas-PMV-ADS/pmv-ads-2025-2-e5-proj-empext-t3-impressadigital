import { DataSource } from 'typeorm';
import { ComentarioProduto } from 'src/core/database/entities/comentario_produtos.entity';

export const comentarioProdutoProviders = [
  {
    provide: 'COMENTARIO_PRODUTO_REPOSITORY', // deve bater com @Inject no service
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ComentarioProduto),
    inject: ['DATA_SOURCE'],
  },
];
