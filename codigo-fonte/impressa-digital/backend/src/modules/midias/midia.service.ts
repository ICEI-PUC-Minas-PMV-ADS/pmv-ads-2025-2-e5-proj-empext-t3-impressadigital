import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Midias } from '../../core/database/entities/midias.entity';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class MidiasService {
  constructor(
    @Inject('MIDIAS_REPOSITORY')
    private midiasRepository: Repository<Midias>,
    private cloudinaryService: CloudinaryService,
  ) {}

  findAll(): Promise<Midias[]> {
    return this.midiasRepository.find({ relations: ['produto'] });
  }

  async findOne(id: number): Promise<Midias> {
    const midia = await this.midiasRepository.findOne({
      where: { id },
      relations: ['produto'],
    });

    if (!midia) {
      console.log(`Mídia com ID ${id} não encontrada no banco de dados`);
      throw new NotFoundException(`Mídia ${id} não encontrada`);
    }

    return midia;
  }

  create(data: Partial<Midias>): Promise<Midias> {
    const midia = this.midiasRepository.create(data);
    return this.midiasRepository.save(midia);
  }

  async update(id: number, data: Partial<Midias>): Promise<Midias> {
    await this.midiasRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    console.log(`🔍 Buscando mídia ${id} no banco...`);
    const midia = await this.midiasRepository.findOne({
      where: { id },
      relations: ['produto'],
    });

    if (!midia) {
      console.log(`❌ Mídia ${id} não encontrada no banco`);
      throw new NotFoundException(`Mídia ${id} não encontrada`);
    }

    if (midia.public_id) {
      try {
        await this.cloudinaryService.deleteImage(midia.public_id);
      } catch (error) {
        console.error('❌ Erro ao excluir do Cloudinary:', error);
      }
    } else {
      console.warn(`⚠️ Mídia ${id} não possui public_id`);
    }

    await this.midiasRepository.delete(id);
  }

  async createWithUpload(files: any[], produtoId: number): Promise<Midias[]> {
    try {
      const uploadResults = await this.cloudinaryService.uploadMultipleImages(
        files,
        'produtos',
      );
      const savedMidias: Midias[] = [];

      for (const result of uploadResults) {
        const midiaData = {
          url: result.secure_url,
          tipo: 'imagem',
          public_id: result.public_id,
          produto: { id: produtoId } as any,
        };

        const midia = this.midiasRepository.create(midiaData);
        const savedMidia = await this.midiasRepository.save(midia);
        savedMidias.push(savedMidia);
      }

      return savedMidias;
    } catch (error) {
      console.error('❌ Erro em createWithUpload:', error);
      throw new Error('Falha ao enviar e salvar imagens do produto');
    }
  }

  async createForAvaliacao(
    files: any[],
    avaliacaoId: number,
  ): Promise<Midias[]> {
    try {
      const uploadResults = await this.cloudinaryService.uploadMultipleImages(
        files,
        'avaliacoes',
      );
      const savedMidias: Midias[] = [];

      for (const result of uploadResults) {
        const midiaData = {
          url: result.secure_url,
          tipo: 'imagem',
          public_id: result.public_id,
          avaliacao: { id: avaliacaoId } as any,
        };

        const midia = this.midiasRepository.create(midiaData);
        const savedMidia = await this.midiasRepository.save(midia);
        savedMidias.push(savedMidia);
      }

      return savedMidias;
    } catch (error) {
      console.error('❌ Erro em createForAvaliacao:', error);
      throw new Error('Falha ao enviar e salvar imagens da avaliação');
    }
  }

  async removeByProdutoId(produtoId: number): Promise<void> {
    const midias = await this.midiasRepository.find({
      where: { produto: { id: produtoId } },
    });

    for (const midia of midias) {
      await this.remove(midia.id);
    }
  }

  async findByProdutoId(produtoId: number): Promise<Midias[]> {
    return this.midiasRepository.find({
      where: { produto: { id: produtoId } },
      relations: ['produto'],
    });
  }
}
