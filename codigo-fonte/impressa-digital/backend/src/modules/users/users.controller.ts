import { Body, Controller, Get, Post, Put, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { User, UserRole } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() body: { name: string; email: string; password: string; role?: UserRole },
  ): Promise<User> {
    return this.userService.createUser(body);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id); // 🔄 corrigido
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() data: Partial<User>) {
    return this.userService.updateUser(id, data);
  }
}
