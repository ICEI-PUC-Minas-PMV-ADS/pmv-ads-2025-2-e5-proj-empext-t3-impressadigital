import { Module } from '@nestjs/common';
import { AuthdbModule } from 'src/core/database/authdb.module';
import { Avaliacoes_ProdutoProviders } from './repository/avaliacoes_produtos.provider';
import { Avaliacoes_produtosService } from './avaliacoes_produtos.service';
import { Avaliacoes_produtosController } from './avaliacoes_produtos.controller';

@Module({
  imports: [AuthdbModule],
  providers: [...Avaliacoes_ProdutoProviders, Avaliacoes_produtosService],
  controllers: [Avaliacoes_produtosController],
  exports: [...Avaliacoes_ProdutoProviders],
})
export class Avaliacoes_produtosModule {}
