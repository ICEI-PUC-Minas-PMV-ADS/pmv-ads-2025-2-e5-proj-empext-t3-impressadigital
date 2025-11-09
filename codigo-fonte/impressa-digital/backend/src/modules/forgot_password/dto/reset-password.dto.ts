import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @Matches(/(?=.*[A-Z])/, { message: 'Senha deve conter pelo menos uma letra maiúscula' })
  @Matches(/(?=.*\d)/, { message: 'Senha deve conter pelo menos um número' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'Senha deve conter pelo menos um caractere especial (!@#$%^&*)' })
  password: string;
}
