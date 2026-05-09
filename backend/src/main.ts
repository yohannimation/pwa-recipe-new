import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const fastifyInstance = app.getHttpAdapter().getInstance() as FastifyInstance;
  await fastifyInstance.register(multipart, {
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  });
  app.useStaticAssets({
    root: join(process.cwd(), 'src', 'uploads'),
    prefix: '/uploads/',
  });

  app.setGlobalPrefix('api'); // All routes be prefixed by `/api/`
  await app.listen(3000, '0.0.0.0'); // `0.0.0.0` for docker
}
bootstrap();
