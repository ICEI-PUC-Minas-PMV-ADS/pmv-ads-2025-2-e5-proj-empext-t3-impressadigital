// midias.module.ts
import { Module } from '@nestjs/common';
import { MidiasService } from './midia.service';
import { MidiasController } from './midia.controller';
import { midiasProviders } from './repository/midias.provider';
import { AuthdbModule } from 'src/core/database/authdb.module';
import { CloudinaryModule } from './cloudinary.module';

@Module({
  imports: [AuthdbModule, CloudinaryModule],
  providers: [...midiasProviders, MidiasService],
  controllers: [MidiasController],
  exports: [...midiasProviders],
})
export class MidiasModule {}