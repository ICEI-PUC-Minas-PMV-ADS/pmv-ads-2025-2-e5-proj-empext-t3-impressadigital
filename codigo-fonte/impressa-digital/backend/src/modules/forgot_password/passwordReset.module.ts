import { Module } from '@nestjs/common';
import { PasswordResetService } from './passwordReset.service';
import { PasswordResetController } from './passwordReset.controller';
import { MailService } from '../mailService/mail.service';
import { passwordResetProviders } from './repository/passwordReset.providers';
import { AuthdbModule } from 'src/core/database/authdb.module';

@Module({
   imports: [AuthdbModule],
  controllers: [PasswordResetController],
  providers: [PasswordResetService, MailService, ...passwordResetProviders],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}