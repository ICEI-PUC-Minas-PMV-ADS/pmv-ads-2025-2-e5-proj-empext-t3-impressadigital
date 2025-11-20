import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app/app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  console.log("JWT_SECRET BACKEND:", JSON.stringify(process.env.JWT_SECRET));
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:8081',
      'http://localhost:19006',
      'https://impressadigital.pages.dev',
    ];

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
