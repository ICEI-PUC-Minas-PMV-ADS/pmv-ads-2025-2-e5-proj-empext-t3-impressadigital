import { Customer_addressService } from './customer_address.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [
        Customer_addressService,],
})
export class Customer_addressModule { }
