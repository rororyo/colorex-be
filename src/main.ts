import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
      ];
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.ngrok-free.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  // Global Validation Configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Colorex API')
    .setDescription('Colorex API Documentation')
    .setVersion('1.0')
    .addBearerAuth() // Optional: Add JWT-based authentication
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(5000);
}
bootstrap();
