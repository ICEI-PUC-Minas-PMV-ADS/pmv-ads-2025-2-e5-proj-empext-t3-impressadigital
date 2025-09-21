// authdb.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../modules/users/user.entity';
import { UserRepository } from '../../modules/users/repositories/user.repository';
import { UserService } from '../../modules/users/users.service';
import { UserController } from '../../modules/users/users.controller';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: (dataSource: DataSource) => dataSource,
      inject: [DataSource],
    },
    UserRepository,
    UserService,
  ],
  controllers: [UserController],
  exports: [
    'DATA_SOURCE', // exporta o provider
    UserRepository,
    UserService,
  ],
})
export class AuthDbModule {}
