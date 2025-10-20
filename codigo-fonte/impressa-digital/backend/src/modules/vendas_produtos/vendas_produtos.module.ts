
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { VendasProdutosController } from './vendas_produtos.controller';
import { vendas_produtosProviders } from './repositories/vendas_produtos';
import { VendasProdutosService } from './vendas_produtos.service';
import { AuthdbModule } from 'src/core/database/authdb.module';

@Module({
     imports: [AuthdbModule],
    controllers: [VendasProdutosController],
    providers: [...vendas_produtosProviders, VendasProdutosService ],
    exports:[VendasProdutosService]
})
export class Vendas_produtosModule {}
