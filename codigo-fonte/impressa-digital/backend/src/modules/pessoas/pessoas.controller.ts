/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { Pessoas } from 'src/core/database/entities/pessoas.entity';

@Controller("pessoas")
export class PessoasController {

    constructor(private readonly pessoasService: PessoasService) { }

    @Get("findAll")
    async findAll(): Promise<Pessoas[]> {
        return this.pessoasService.findAll();
    }
    @Get("findById")
    async findById(@Query('pessoa_id') pessoa_id: number): Promise<Pessoas | null> {
        return await this.pessoasService.findById(pessoa_id);
    }

    @Post("create")
    async create(@Body() pessoa: Pessoas): Promise<number> {
        return this.pessoasService.create(pessoa);
    }

    @Delete("deletebyId")
    async deletebyId(@Query('pessoa_id') pessoa_id: number): Promise<void> {
        await this.pessoasService.deletebyId(pessoa_id);
    }





}
