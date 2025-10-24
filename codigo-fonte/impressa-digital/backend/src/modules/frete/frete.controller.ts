import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { FreteService } from './frete.service';
import { CreateFreteDto } from './dto/create-frete.dto';

@Controller('frete')
export class FreteController {
  constructor(private readonly freteService: FreteService) {}

  @Post('calcular')
  async calcularFrete(@Body(ValidationPipe) createFreteDto: CreateFreteDto) {
    console.log('📩 Requisição recebida:', createFreteDto);

    return this.freteService.calcularFrete(
      createFreteDto.cepDestino,
      createFreteDto.produtos
    );
  }
}