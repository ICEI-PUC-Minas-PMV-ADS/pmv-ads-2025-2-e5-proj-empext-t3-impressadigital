import { Body, Controller, Get, Post, Put, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from 'src/core/database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

@Post()
async createUser(@Body() body: CreateUserDto): Promise<User> {
  return this.userService.createUser(body);
}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() data: Partial<User>) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Patch(':id/restore')
  async restoreUser(@Param('id') id: number): Promise<User> {
    return this.userService.restoreUser(id);
  }

  @Get('deleted/all')
  async getDeletedUsers(): Promise<User[]> {
    return this.userService.findDeletedUsers();
  }

  @Get(':id/with-deleted')
  async getUserByIdWithDeleted(@Param('id') id: number): Promise<User> {
    return this.userService.findByIdIncludingDeleted(id);
  }
}
