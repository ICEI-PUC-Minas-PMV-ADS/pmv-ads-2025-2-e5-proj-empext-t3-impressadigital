import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Midias } from '../../core/database/entities/midias.entity';
import { CloudinaryService } from './cloudinary.service';

interface CloudinaryFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

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
    if (!midia) throw new NotFoundException(`Mídia ${id} não encontrada`);
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
    await this.midiasRepository.delete(id);
  }

    async createWithUpload(files: any[], produtoId: number): Promise<Midias[]> {
    try {
      const uploadResults = await this.cloudinaryService.uploadMultipleImages(files);
      const savedMidias: Midias[] = [];

      for (const result of uploadResults) {
        const midiaData = {
          url: result.secure_url,
          tipo: 'imagem',
          produto: { id: produtoId } as any,
        };

        const midia = this.midiasRepository.create(midiaData);
        const savedMidia = await this.midiasRepository.save(midia);
        savedMidias.push(savedMidia);
      }

      return savedMidias;
    } catch (error) {
      console.error('Error in createWithUpload:', error);
      throw new Error('Failed to upload images and create media records');
    }
  }
}