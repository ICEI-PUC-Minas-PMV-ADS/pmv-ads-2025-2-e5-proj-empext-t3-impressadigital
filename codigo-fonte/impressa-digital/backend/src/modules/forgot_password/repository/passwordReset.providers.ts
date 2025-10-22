import { DataSource } from 'typeorm';
import { PasswordResetToken } from '../../../core/database/entities/password_reset_tokens.entity';
import { User } from '../../../core/database/entities/user.entity';

export const passwordResetProviders = [
  {
    provide: 'PASSWORD_RESET_TOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PasswordResetToken),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
];
