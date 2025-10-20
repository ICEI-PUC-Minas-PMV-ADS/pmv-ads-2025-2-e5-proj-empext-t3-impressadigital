import { Module } from '@nestjs/common';
import { AuthdbModule } from 'src/core/database/authdb.module';
import { comentarioProdutoProviders } from './repository/comentario_produtos.provider';
import { ComentarioProdutoService } from './comentario_produtos.service';
import { ComentarioProdutoController } from './comentario_produtos.controller';

@Module({
  imports: [AuthdbModule],
  controllers: [ComentarioProdutoController],
  providers: [ComentarioProdutoService, ...comentarioProdutoProviders],
  exports: [ComentarioProdutoService], // ✅ exporta o service, não o provider
})
export class ComentarioProdutosModule {}
