import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Enable CORS - PENTING untuk akses dari frontend
  app.enableCors({
    origin: '*', // Dalam production, ganti dengan URL frontend yang spesifik
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Serve static files - CRITICAL FIX
  const uploadsPath = join(__dirname, '..', 'uploads');
  console.log('[Static Files] Serving uploads from:', uploadsPath);
  
  // Method 1: Using NestJS useStaticAssets (preferred)
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });
  
  // Method 2: Using express.static as fallback
  app.use('/uploads', express.static(uploadsPath));
  
  const port = process.env.PORT || 4003;
  await app.listen(port);
  console.log(`Attendance Service is running on: http://localhost:${port}`);
  console.log(`Static files accessible at: http://localhost:${port}/uploads/`);
}
bootstrap();