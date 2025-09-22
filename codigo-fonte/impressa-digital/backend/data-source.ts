import { DataSource } from 'typeorm';
import { User } from '../backend/src/core/database/entities/user.entity';
import { Carrinho } from '../backend/src/core/database/entities/carrinho.entity';
import { CustomerAddress } from '../backend/src/core/database/entities/customer_address.entity';
import { Vendas } from '../backend/src/core/database/entities/vendas.entity';
import { CarrinhoProdutos } from '../backend/src/core/database/entities/carrinho_produto.entity';
import { Produtos } from '../backend/src/core/database/entities/products.entity';
import { Midias } from '../backend/src/core/database/entities/midias.entity';
import { Categorias } from '../backend/src/core/database/entities/category.entity';
import { Catalogos } from '../backend/src/core/database/entities/catalogo.entity';
import { CatalogoProdutos } from '../backend/src/core/database/entities/catalogo_produtos.entity';
import 'dotenv/config';


export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.ATABASE_HOST || 'ballast.proxy.rlwy.net',
  port: Number(process.env.DATABASE_PORT) || 17688,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'nYewiaNBnFDhNoIiyzfFRYktWACyRGCZ',
  database: process.env.DATABASE_NAME || 'impressa_digital',
  synchronize: false,
  logging: true,
    entities: [
        User, 
        Carrinho, 
        CustomerAddress, 
        Vendas, 
        CarrinhoProdutos, 
        Produtos, 
        Midias, 
        Categorias,
        Catalogos,
        CatalogoProdutos,
        
    ],

  migrations: ['src/core/database/migrations/*.ts'],
});
