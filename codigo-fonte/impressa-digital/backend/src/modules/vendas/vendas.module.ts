import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { vendasProviders } from './repositories/vendas.provider';
import { AuthdbModule } from 'src/core/database/authdb.module';

@Module({
    imports: [AuthdbModule],
    providers: [...vendasProviders,VendasService],
    controllers: [VendasController,],
    exports:[...vendasProviders]
})
export class VendasModule { }
