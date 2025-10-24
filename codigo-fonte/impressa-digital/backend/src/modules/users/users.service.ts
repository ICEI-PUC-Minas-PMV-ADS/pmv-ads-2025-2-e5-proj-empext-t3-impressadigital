import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/core/database/entities/user.entity'; // ✅ importe o enum
import { Repository, IsNull, Not } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role:
        userData.role &&
        Object.values(UserRole).includes(userData.role as UserRole)
          ? (userData.role as UserRole)
          : UserRole.CLIENTE,
    });

    await this.userRepository.save(newUser);
    newUser.password = '';
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['enderecos'],
      where: { deletedAt: IsNull() },
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
      relations: ['enderecos'],
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
        deletedAt: IsNull(),
      },
      select: ['id', 'name', 'email', 'role', 'cpf', 'birthDate', 'password'],
    });
    if (!user)
      throw new NotFoundException(
        `Usuário com e-mail: ${email} não encontrado`,
      );
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
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
      relations: ['enderecos'],
    });
    if (!updatedUser) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
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
      relations: ['enderecos'],
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
      relations: ['enderecos'],
      withDeleted: true,
    });
  }

  async findByIdIncludingDeleted(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['enderecos'],
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    return user;
  }
}
