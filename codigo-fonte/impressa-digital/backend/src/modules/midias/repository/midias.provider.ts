import { DataSource } from 'typeorm';
import { Midias } from '../../../core/database/entities/midias.entity';

export const midiasProviders = [
  {
    provide: 'MIDIAS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Midias),
    inject: ['DATA_SOURCE'],
  },
];