import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',  // Backend
      'http://localhost:3001',  // Frontend
      'http://localhost:8081',  
      'http://localhost:19006', 
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
