import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    birthDate?: Date;
    cpf?: string;
    endereco?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? UserRole.CLIENT,
      birthDate: data.birthDate,
      cpf: data.cpf,
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    if (data.password) {
      // se senha foi enviada, aplica hash
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.update(id, data);

    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
