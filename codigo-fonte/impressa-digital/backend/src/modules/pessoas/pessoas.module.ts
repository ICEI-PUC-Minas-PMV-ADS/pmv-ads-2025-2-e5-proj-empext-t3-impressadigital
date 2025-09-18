/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { pessoasProviders } from './repository/pessoas.provider';
import { AuthdbModule } from 'src/core/database/authdb.module';
import { PessoasRepository } from './repository/pessoas.repository';
import { PessoasController } from './pessoas.controller';
import { PessoasService } from './pessoas.service';

@Module({
    imports: [AuthdbModule],
    controllers: [PessoasController],
    providers: [...pessoasProviders,PessoasRepository,PessoasService ],


})
export class PessoasModule {}
