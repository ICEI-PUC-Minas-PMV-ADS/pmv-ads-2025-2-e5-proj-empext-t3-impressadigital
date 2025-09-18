import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        VendasController,],
    providers: [
        VendasService,],
})
export class VendasModule { }
