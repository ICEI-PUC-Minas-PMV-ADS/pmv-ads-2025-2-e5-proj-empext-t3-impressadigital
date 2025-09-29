import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerAddress } from 'src/core/database/entities/customer_address.entity';

@Injectable()
export class CustomerAddressService {
  constructor(
    @Inject('CUSTOMER_ADDRESS_REPOSITORY')
    private readonly addressRepository: Repository<CustomerAddress>,
  ) {}

  async findAll(): Promise<CustomerAddress[]> {
    return this.addressRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<CustomerAddress> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!address) throw new NotFoundException(`Endereço ${id} não encontrado`);
    return address;
  }

  async create(data: Partial<CustomerAddress>): Promise<CustomerAddress> {
    const address = this.addressRepository.create(data);
    return this.addressRepository.save(address);
  }

  async update(id: number, data: Partial<CustomerAddress>): Promise<CustomerAddress> {
    const address = await this.findOne(id);
    Object.assign(address, data);
    return this.addressRepository.save(address);
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
  }
}
