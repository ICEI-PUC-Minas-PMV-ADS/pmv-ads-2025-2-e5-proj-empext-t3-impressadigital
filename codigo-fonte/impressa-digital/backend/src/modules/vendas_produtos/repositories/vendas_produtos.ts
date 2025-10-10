import { VendasProdutos } from 'src/core/database/entities/vendas_produtos.entity';
import { DataSource } from 'typeorm';


export const vendas_produtosProviders = [
  {
    provide: 'VENDAS_PRODUTOS_REPOSITORY', // deve bater com @Inject no service
    useFactory: (dataSource: DataSource) => dataSource.getRepository(VendasProdutos),
    inject: ['DATA_SOURCE'],
  },
];
