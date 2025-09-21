export class CreateUserDto {
  name: string;
  email: string;
  birthDate?: Date;
  cpf?: string;
  password: string;
  role?: string; 
}
