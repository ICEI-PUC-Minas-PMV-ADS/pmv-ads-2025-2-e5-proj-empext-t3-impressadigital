import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetToken } from '../../core/database/entities/password_reset_tokens.entity';
import { User } from '../../core/database/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mailService/mail.service';

@Injectable()
export class PasswordResetService {
  constructor(
    @Inject('PASSWORD_RESET_TOKEN_REPOSITORY')
    private readonly tokenRepo: Repository<PasswordResetToken>,

    @Inject('USER_REPOSITORY')
    private readonly userRepo: Repository<User>,

    private readonly mailService: MailService,
  ) {}

  async requestPasswordReset(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      return { message: 'Se existir uma conta com este e-mail, enviaremos o link.' };
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

    const resetToken = this.tokenRepo.create({ user, token, expiresAt });
    await this.tokenRepo.save(resetToken);

    await this.mailService.sendPasswordReset(user.email, token);

    return { message: 'Se existir uma conta com este e-mail, enviaremos o link.' };
  }

  async sendPasswordResetToUser(email: string, adminId: number) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Usuário não encontrado');

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

    const resetToken = this.tokenRepo.create({ user, token, expiresAt });
    await this.tokenRepo.save(resetToken);

    await this.mailService.sendPasswordReset(user.email, token);

    return { message: `E-mail de recuperação enviado para ${user.email}` };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.tokenRepo.findOne({
      where: { token: dto.token },
      relations: ['user'],
    });

    if (!record || record.used || record.expiresAt < new Date()) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    record.user.password = hashed;
    record.used = true;

    await this.tokenRepo.manager.transaction(async (manager) => {
      await manager.save(record.user);
      await manager.save(record);
    });

    return { message: 'Senha redefinida com sucesso' };
  }
}
