import { Module } from '@nestjs/common';
import { AuthdbModule } from 'src/core/database/authdb.module';
import { catalogoProviders } from './repository/catalogo.provider';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';


@Module({
     imports: [AuthdbModule],
     providers: [...catalogoProviders,CatalogoService],
    controllers: [CatalogoController],
    exports:[...catalogoProviders]
})
export class CatalogModule {}
