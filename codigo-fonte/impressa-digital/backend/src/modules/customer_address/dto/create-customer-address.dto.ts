import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCustomerAddressDto {
  @IsNumber()
  user_id: number;

  @IsString()
  @Length(1, 255)
  logradouro: string;

  @IsString()
  @IsOptional()
  numero?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  complemento?: string;

  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  cidade?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  @Length(8, 9)
  cep?: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;
}

export class UpdateCustomerAddressDto {
  @IsString()
  @IsOptional()
  logradouro?: string;

  @IsString()
  @IsOptional()
  numero?: string;

  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  cidade?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean;

  @IsNumber()
  @IsOptional()
  user_id?: number;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  complemento?: string;
}
