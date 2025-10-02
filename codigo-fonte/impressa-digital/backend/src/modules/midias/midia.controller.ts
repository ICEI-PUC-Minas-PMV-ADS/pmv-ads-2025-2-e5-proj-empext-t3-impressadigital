import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseInterceptors, 
  UploadedFiles,
  BadRequestException 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
async remove(@Param('id') id: number): Promise<void> {
  
  try {
    const midia = await this.midiasService.findOne(+id);
    
    await this.midiasService.remove(+id);
    
  } catch (error) {
    console.error(`❌ Erro ao excluir mídia ${id}:`, error);
    throw error;
  }
}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @UploadedFiles() files: any[],
    @Body('produto_id') produtoId: number,
  ): Promise<Midias[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    if (!produtoId) {
      throw new BadRequestException('ID do produto é obrigatório');
    }

    return this.midiasService.createWithUpload(files, +produtoId);
  }
}