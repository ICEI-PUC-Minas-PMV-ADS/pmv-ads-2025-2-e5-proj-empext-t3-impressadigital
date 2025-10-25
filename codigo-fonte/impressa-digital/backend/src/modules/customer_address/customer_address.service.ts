import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerAddress } from 'src/core/database/entities/customer_address.entity';
import {
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
} from './dto/create-customer-address.dto';

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

  async create(data: CreateCustomerAddressDto): Promise<CustomerAddress> {
    if (!data.user_id) {
      throw new BadRequestException('user_id é obrigatório');
    }

    // Limite de endereços
    const existingAddresses = await this.addressRepository.count({
      where: { user_id: data.user_id },
    });

    if (existingAddresses >= 3) {
      throw new BadRequestException(
        'O usuário já possui o limite máximo de 3 endereços.',
      );
    }

    if (data.is_primary) {
      await this.unsetPrimaryAddresses(data.user_id);
    } else if (existingAddresses === 0) {
      data.is_primary = true;
    }

    const address = this.addressRepository.create(data);
    return this.addressRepository.save(address);
  }

  async update(
    id: number,
    data: UpdateCustomerAddressDto,
  ): Promise<CustomerAddress> {
    const address = await this.findOne(id);

    const userId = data.user_id ?? address.user_id;

    if (data.is_primary) {
      await this.unsetPrimaryAddresses(userId);
    }

    Object.assign(address, data);
    return this.addressRepository.save(address);
  }

  async setPrimaryAddress(
    userId: number,
    addressId: number,
  ): Promise<CustomerAddress> {
    const address = await this.findOne(addressId);
    if (!address || address.user_id !== userId) {
      throw new BadRequestException('Endereço não pertence a este usuário');
    }

    await this.unsetPrimaryAddresses(userId);
    address.is_primary = true;
    return this.addressRepository.save(address);
  }

  private async unsetPrimaryAddresses(userId: number): Promise<void> {
    await this.addressRepository
      .createQueryBuilder()
      .update(CustomerAddress)
      .set({ is_primary: false })
      .where('user_id = :userId', { userId })
      .execute();
  }

  async findPrimaryByUserId(userId: number): Promise<CustomerAddress | null> {
    return this.addressRepository.findOne({
      where: { user_id: userId, is_primary: true },
      relations: ['user'],
    });
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
  }

  async findByUserId(userId: number): Promise<CustomerAddress[]> {
    return this.addressRepository.find({
      where: { user_id: userId },
      relations: ['user'],
    });
  }
}
