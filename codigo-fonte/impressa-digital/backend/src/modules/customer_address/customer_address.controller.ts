import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomerAddress } from 'src/core/database/entities/customer_address.entity';
import { CustomerAddressService } from './customer_address.service';

@Controller('customer_address')
export class CustomerAddressController {
  constructor(private readonly addressService: CustomerAddressService) {}

  @Get()
  async findAll(): Promise<CustomerAddress[]> {
    return this.addressService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerAddress> {
    return this.addressService.findOne(id);
  }

  @Post()
  async create(
    @Body() data: Partial<CustomerAddress>,
  ): Promise<CustomerAddress> {
    return this.addressService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CustomerAddress>,
  ): Promise<CustomerAddress> {
    return this.addressService.update(id, data);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.addressService.remove(id);
    return { message: `Endereço ${id} removido com sucesso` };
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CustomerAddress[]> {
    return this.addressService.findByUserId(userId);
  }
}
