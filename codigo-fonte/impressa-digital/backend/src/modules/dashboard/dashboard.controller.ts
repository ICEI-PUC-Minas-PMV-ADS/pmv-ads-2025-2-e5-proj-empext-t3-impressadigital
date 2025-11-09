import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../core/database/auth/jwt-auth.guard';
import { RolesGuard } from '../../core/database/auth/commons/guards/roles.guard';
import { Roles } from '../../core/database/auth/commons/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class DashboardController {

  @Get()
  @Roles('admin', 'owner') 
  getDashboard() {
    return { message: "Bem-vindo ao dashboard!" };
  }

  @Get('configs')
  @Roles('owner') 
  getConfigs() {
    return { message: "Configurações sensíveis só para owner!" };
  }
}
