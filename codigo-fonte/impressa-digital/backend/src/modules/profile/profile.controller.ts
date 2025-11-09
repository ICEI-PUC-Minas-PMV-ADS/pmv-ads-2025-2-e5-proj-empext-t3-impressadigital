
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/database/auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {

  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}
