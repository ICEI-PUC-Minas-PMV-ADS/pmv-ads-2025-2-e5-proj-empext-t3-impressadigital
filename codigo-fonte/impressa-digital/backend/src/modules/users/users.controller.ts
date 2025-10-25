import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from 'src/core/database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from '../../core/database/auth/commons/guards/roles.guard';
import { Roles } from '../../core/database/auth/commons/decorators/roles.decorator';
import { JwtAuthGuard } from '../../core/database/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async createUser(
    @Body() body: CreateUserDto,
    @Req() req: any,
  ): Promise<User> {
    const currentUser = req.user;
    return this.userService.createUser(body, currentUser);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  async deleteUser(@Param('id') id: number, @Req() req: any): Promise<void> {
    const currentUser = req.user;

    const userToDelete = await this.userService.findByIdIncludingDeleted(
      Number(id),
    );
    if (
      (userToDelete.role === 'admin' || userToDelete.role === 'owner') &&
      currentUser.role !== 'owner'
    ) {
      throw new ForbiddenException(
        'Apenas owners podem desativar admins ou owners',
      );
    }

    return this.userService.deleteUser(Number(id), currentUser);
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
