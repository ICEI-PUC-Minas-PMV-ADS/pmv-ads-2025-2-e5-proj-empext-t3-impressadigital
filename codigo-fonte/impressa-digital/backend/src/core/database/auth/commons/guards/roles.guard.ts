import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/core/database/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true; 

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Acesso negado. Requer permissão de: ${requiredRoles.join(' ou ')}`
      );
    }

    if (request.body && request.body.role) {
      const sensitiveRoles = [UserRole.ADMIN, UserRole.OWNER];
      if (sensitiveRoles.includes(request.body.role) && user.role !== UserRole.OWNER) {
        throw new ForbiddenException('Apenas owners podem criar ou atribuir roles sensíveis');
      }
    }

    return true;
  }
}
