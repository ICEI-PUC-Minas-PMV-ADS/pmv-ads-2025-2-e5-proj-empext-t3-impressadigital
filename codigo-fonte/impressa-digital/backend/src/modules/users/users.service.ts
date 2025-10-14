import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/core/database/entities/user.entity';
import { Repository } from 'typeorm';

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
    return this.userRepository.find({ relations: ['endereco'] });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['endereco'],
      select: ['id', 'name', 'email', 'role', 'cpf', 'birthDate'],
    });
    if (!user)
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'role', 'cpf', 'birthDate', 'password'],
    });
    if (!user)
      throw new NotFoundException(
        `Usuário com e-mail: ${email} não encontrado`,
      );
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    if (data.password) {
      // se senha foi enviada, aplica hash
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.update(id, data);

    const updatedUser = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'cpf', 'birthDate'],
      relations: ['endereco'],
    });
    if (!updatedUser) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
