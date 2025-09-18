import { CarrinhoService } from './carrinho.service';
import { CarrinhoController } from './carrinho.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        CarrinhoController,],
    providers: [
        CarrinhoService,],
})
export class CarrinhoModule { }
