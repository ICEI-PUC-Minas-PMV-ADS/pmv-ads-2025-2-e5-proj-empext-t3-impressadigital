import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.login(
      body.email,
      body.password,
    );

    // seta cookie seguro
    res.cookie('token', token, {
      httpOnly: true, 
      secure: true, 
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });
    return { message: 'Logout realizado com sucesso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req) {
    return { user: req.user };
  }
}
