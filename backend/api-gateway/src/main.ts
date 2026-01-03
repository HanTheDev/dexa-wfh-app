import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Enable CORS
  app.enableCors({
    origin: '*', // In production, specify your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`API Gateway is running on: http://localhost:${port}`);
  console.log(`API Docs available at: http://localhost:${port}/api`);
}
bootstrap();