import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MidiasService } from './midia.service';
import { Midias } from '../../core/database/entities/midias.entity';

@Controller('midias')
export class MidiasController {
  constructor(private readonly midiasService: MidiasService) {}

  @Get()
  findAll(): Promise<Midias[]> {
    return this.midiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Midias> {
    return this.midiasService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Midias>): Promise<Midias> {
    return this.midiasService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Midias>): Promise<Midias> {
    return this.midiasService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.midiasService.remove(+id);
  }
}
