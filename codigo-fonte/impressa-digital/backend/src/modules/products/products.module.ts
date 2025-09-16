import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [ProductsController],
    providers: [ProductsService],  
    exports: [ProductsService]
})
export class ProductsModule { }
