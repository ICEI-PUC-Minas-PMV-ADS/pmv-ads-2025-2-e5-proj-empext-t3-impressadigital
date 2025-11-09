import {
  IsArray,
  IsNotEmpty,
  IsPostalCode,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProdutoDto {
  @IsNotEmpty({ message: 'Largura é obrigatória' })
  @IsNumber({}, { message: 'Largura deve ser um número' })
  @Min(1, { message: 'Largura mínima é 1cm' })
  @Max(200, { message: 'Largura máxima é 200cm' })
  width: number;

  @IsNotEmpty({ message: 'Altura é obrigatória' })
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(1, { message: 'Altura mínima é 1cm' })
  @Max(200, { message: 'Altura máxima é 200cm' })
  height: number;

  @IsNotEmpty({ message: 'Comprimento é obrigatório' })
  @IsNumber({}, { message: 'Comprimento deve ser um número' })
  @Min(1, { message: 'Comprimento mínimo é 1cm' })
  @Max(200, { message: 'Comprimento máximo é 200cm' })
  length: number;

  @IsNotEmpty({ message: 'Peso é obrigatório' })
  @IsNumber({}, { message: 'Peso deve ser um número' })
  @Min(0.01, { message: 'Peso mínimo é 0.01kg' })
  @Max(50, { message: 'Peso máximo é 50kg' })
  weight: number;

  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(1, { message: 'Quantidade mínima é 1' })
  quantity: number;

  @IsOptional()
  @IsNumber({}, { message: 'insurance_value deve ser um número' })
  @Min(0, { message: 'insurance_value mínimo é 0' })
  insurance_value?: number;
}

export class CreateFreteDto {
  @IsPostalCode('BR', { message: 'CEP inválido' })
  cepDestino: string;

  @IsArray({ message: 'Produtos deve ser uma lista' })
  @ValidateNested({ each: true })
  @Type(() => ProdutoDto)
  produtos: ProdutoDto[];
}