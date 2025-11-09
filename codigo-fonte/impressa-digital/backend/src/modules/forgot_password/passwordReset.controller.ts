import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PasswordResetService } from './passwordReset.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../core/database/auth/jwt-auth.guard';

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly resetService: PasswordResetService) {}

  @Post('forgot')
  async forgot(@Body() dto: ForgotPasswordDto) {
    return this.resetService.requestPasswordReset(dto);
  }

  @Post('reset')
  async reset(@Body() dto: ResetPasswordDto) {
    return this.resetService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-to-user')
  async sendToUser(@Body() dto: ForgotPasswordDto, @Req() req) {
    const adminId = req.user.id;
    return this.resetService.sendPasswordResetToUser(dto.email, adminId);
  }
}
