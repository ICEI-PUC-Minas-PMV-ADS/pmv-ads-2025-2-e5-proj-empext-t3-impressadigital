import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { CustomerAddress } from 'src/core/database/entities/customer_address.entity';
import { CustomerAddressService } from './customer_address.service';
import { CreateCustomerAddressDto, UpdateCustomerAddressDto } from './dto/create-customer-address.dto';

@Controller('customer_address')
export class CustomerAddressController {
  constructor(private readonly addressService: CustomerAddressService) {}

  // Buscar todos os endereços
  @Get()
  async findAll(): Promise<CustomerAddress[]> {
    return this.addressService.findAll();
  }

  // Buscar endereços de um usuário
  @Get('user/:userId')
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CustomerAddress[]> {
    return this.addressService.findByUserId(userId);
  }

  // Buscar endereço principal de um usuário
  @Get('user/:userId/primary')
  async findPrimaryByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<CustomerAddress> {
    const address = await this.addressService.findPrimaryByUserId(userId);
    if (!address) {
      throw new NotFoundException('Endereço principal não encontrado');
    }
    return address;
  }

  // Buscar endereço específico
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CustomerAddress> {
    return this.addressService.findOne(id);
  }

  // Criar novo endereço
  @Post()
  async create(
    @Body() data: CreateCustomerAddressDto,
  ): Promise<CustomerAddress> {
    return this.addressService.create(data);
  }

  // Atualizar endereço
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCustomerAddressDto,
  ): Promise<CustomerAddress> {
    return this.addressService.update(id, data);
  }

  // Definir endereço principal
  @Patch(':id/set-primary')
  async setPrimary(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string; endereco: CustomerAddress }> {
    const endereco = await this.addressService.setPrimaryAddress(userId, id);
    return { message: 'Endereço principal definido com sucesso', endereco };
  }

  // Excluir endereço
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.addressService.remove(id);
    return { message: `Endereço ${id} removido com sucesso` };
  }
}
