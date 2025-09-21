import { Module } from '@nestjs/common';
import { MidiasService } from './midia.service';
import { MidiasController } from './midia.controller';
import { midiasProviders } from './repository/midias.provider';
import { AuthDbModule } from '../../core/database/authdb.module';

@Module({
  imports: [AuthDbModule],
  providers: [...midiasProviders, MidiasService],
  controllers: [MidiasController],
  exports: [...midiasProviders],
})
export class MidiasModule {}
