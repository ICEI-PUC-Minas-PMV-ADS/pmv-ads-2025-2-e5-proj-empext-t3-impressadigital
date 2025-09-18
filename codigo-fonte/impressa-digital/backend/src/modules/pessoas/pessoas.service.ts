/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PessoasRepository } from './repository/pessoas.repository';

@Injectable()
export class PessoasService {

    constructor( private readonly pessoasRepository: PessoasRepository){}


}
