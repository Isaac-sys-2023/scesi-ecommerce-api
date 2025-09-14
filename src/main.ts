import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // 🔥 HABILITAR CORS - Esta es la solución principal
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // Agrega todos los puertos que uses
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept'
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('API para curso frontend (NestJS + Postgres)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  //Imagenes
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // accesibles en http://localhost:3000/uploads/products/imagen.png
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
