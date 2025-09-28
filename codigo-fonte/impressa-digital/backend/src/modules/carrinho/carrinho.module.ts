import { CarrinhoService } from './carrinho.service';
import { CarrinhoController } from './carrinho.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthdbModule } from 'src/core/database/authdb.module';
import { carrinhoProviders } from './repository/carrinho.provider';

@Module({
    imports: [AuthdbModule],
    providers: [...carrinhoProviders,CarrinhoService,],
    controllers: [CarrinhoController,],
    exports:[...carrinhoProviders],
})
export class CarrinhoModule { }
