import { AdmController } from './adm.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        AdmController,],
    providers: [],
})
export class AdmModule { }
