import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import multer from 'multer';
import { join } from 'node:path';
import express from 'express';

async function bootstrap() {
  console.log('Current working directory:', process.cwd());
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // ✅ Разрешаем запросы с фронтенда
    credentials: true, // Если нужно отправлять куки/авторизацию
  });

  app.useGlobalPipes(new ValidationPipe());

  // ✅ Настройка multer для загрузки файлов
  // app.use(
  //   multer({
  //     dest: join(__dirname, '../../../uploads'), // Папка для загрузки
  //   }).single('file'),
  // );

  // ✅ Настройка статической отдачи файлов из папки uploads
  app.use('/uploads', express.static(join(__dirname, '../../../uploads')));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
