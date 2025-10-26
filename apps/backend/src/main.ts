import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import multer from 'multer';
import { join } from 'node:path';

async function bootstrap() {
  console.log('Current working directory:', process.cwd());
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    multer({
      dest: join(__dirname, '../../../uploads'), // Папка для загрузки
    }).any(),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
