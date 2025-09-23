import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { AuthdbModule } from 'src/core/database/authdb.module';
import { userProviders } from './repositories/user.provider';


@Module({
  imports: [AuthdbModule],
  providers: [...userProviders,UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}