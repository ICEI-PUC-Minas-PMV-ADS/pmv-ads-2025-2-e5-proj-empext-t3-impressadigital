// repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(data: Partial<User>) {
    const user = this.create(data);
    return this.save(user);
  }

    async updateUser(id: number, data: Partial<User>) {
    await this.update(id, data);
    return this.findOne({ where: { id } });
  }
}
