/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { Pessoas } from 'src/core/database/entities/pessoas.entity';

@Controller("pessoas")
export class PessoasController {

    constructor(private readonly pessoasService: PessoasService) { }
    
    @Get(":id")
    async findAll(): Promise<Pessoas[]> {
        return this.pessoasService.findAll();
    }



}
