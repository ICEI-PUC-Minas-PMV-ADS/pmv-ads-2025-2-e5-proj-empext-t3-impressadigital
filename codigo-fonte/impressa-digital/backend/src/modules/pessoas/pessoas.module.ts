import { Module } from '@nestjs/common';
import { PessoasController } from './pessoas.controller';
import { PessoasService } from './pessoas.service';
import { PessoasRepository } from './repository/pessoas.repository';
import { pessoasProviders } from './repository/pessoas.provider';
import { AuthDbModule } from '../../core/database/authdb.module';

@Module({
  imports: [AuthDbModule],
  controllers: [PessoasController],
  providers: [...pessoasProviders, PessoasRepository, PessoasService],
})
export class PessoasModule {}
