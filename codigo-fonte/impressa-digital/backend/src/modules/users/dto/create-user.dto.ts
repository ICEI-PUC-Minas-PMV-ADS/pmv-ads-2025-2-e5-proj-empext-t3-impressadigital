import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  Length,
  Matches,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'src/core/database/entities/enum/userRole.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsDateString()
  birthDate: string;

  @IsString()
  @Length(11, 14)
  cpf: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial.',
  })
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'O papel do usuário deve ser admin, cliente ou owner',
  })
  role?: UserRole;
}
