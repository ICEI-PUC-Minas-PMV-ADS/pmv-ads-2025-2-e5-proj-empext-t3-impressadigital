import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/core/database/entities/user.entity';
import { Repository, IsNull, Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    await this.userRepository.save(user);
    user.password = '';
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ 
      relations: ['endereco'],
      where: { deletedAt: IsNull() }
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { 
        id,
        deletedAt: IsNull() 
      },
      relations: ['endereco'],
      select: ['id', 'name', 'email', 'role', 'cpf', 'birthDate'],
    });
    if (!user)
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { 
        email,
        deletedAt: IsNull()
      },
      select: ['id', 'name', 'email', 'role', 'cpf', 'birthDate', 'password'],
    });
    if (!user)
      throw new NotFoundException(`Usuário com e-mail: ${email} não encontrado`);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() }
    });
    if (!existingUser) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.update(id, data);

    const updatedUser = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
      select: ['id', 'name', 'email', 'role', 'cpf', 'birthDate'],
      relations: ['endereco'],
    });
    if (!updatedUser) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() }
    });
    
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    await this.userRepository.softDelete(id);
  }

  async restoreUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true, 
    });

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    if (user.deletedAt === null) {
      throw new NotFoundException(`Usuário com id ${id} já está ativo`);
    }

    await this.userRepository.restore(id);

    const restoredUser = await this.userRepository.findOne({
      where: { id },
      relations: ['endereco'],
      select: ['id', 'name', 'email', 'role', 'cpf', 'birthDate'],
    });

    if (!restoredUser) {
      throw new NotFoundException(`Erro ao recuperar usuário com id ${id}`);
    }

    return restoredUser;
  }

  async findDeletedUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { deletedAt: Not(IsNull()) },
      relations: ['endereco'],
      withDeleted: true,
    });
  }

  async findByIdIncludingDeleted(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['endereco'],
      withDeleted: true,
    });
    
    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    
    return user;
  }
}