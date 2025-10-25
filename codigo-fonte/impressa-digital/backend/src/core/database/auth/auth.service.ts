import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../modules/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
  const user = await this.userService.findByEmail(email);
  if (!user) throw new UnauthorizedException('Usuário não encontrado');

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) throw new UnauthorizedException('Senha inválida');

  const { password: _, ...result } = user; 
  return result;
}


  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const user = await this.validateUser(email, password);

    const payload = { sub: user.id, email: user.email, name: user.name, phone:user.phone, role: user.role, cpf: user.cpf, birthDate: user.birthDate };

    const token = this.jwtService.sign(payload, { expiresIn: '1d'});

    return {
      user,  
      token, 
    };
  }
}
