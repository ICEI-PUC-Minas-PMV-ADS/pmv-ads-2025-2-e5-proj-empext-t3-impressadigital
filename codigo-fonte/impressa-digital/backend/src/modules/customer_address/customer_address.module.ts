
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { customer_addressProviders } from './repository/comentario_produtos.provider';
import { CustomerAddressController } from './customer_address.controller';
import { AuthdbModule } from 'src/core/database/authdb.module';
import { CustomerAddressService } from './customer_address.service';

@Module({
   imports: [AuthdbModule],
   controllers: [CustomerAddressController],
   providers: [...customer_addressProviders,CustomerAddressService],
   exports:[CustomerAddressService]
})
export class Customer_addressModule { }
