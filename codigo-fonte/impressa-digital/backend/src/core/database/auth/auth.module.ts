import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret_key_best_group_rs',
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}