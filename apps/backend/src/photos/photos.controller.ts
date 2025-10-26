import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // ✅ Nest предоставит Multer через FileInterceptor
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PhotosService, CreatePhotoDto } from './photos.service';
import type { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { diskStorage } from 'multer'; // ✅ Импортируем diskStorage
import { join } from 'path'; // ✅ Импортируем join

// ✅ Функция для генерации имени файла
export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const extension = file.originalname.split('.').pop();
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}.${extension}`);
};

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../../../uploads'), // ✅ Указываем папку uploads
        filename: editFileName, // ✅ Используем функцию для генерации имени
      }),
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { description?: string; tags?: string },
    @Req() req: Request,
  ) {
    console.log('File received:', file); // ✅ Лог для отладки
    console.log('Body received:', body);
    if (!file) {
      throw new Error('Файл не был загружен'); // ✅ Добавим проверку
    }

    console.log('File filename:', file.filename);
    console.log('File originalname:', file.originalname);

    const user = req.user as User;
    const tags = body.tags ? body.tags.split(',').map((tag) => tag.trim()) : [];
    const photoDto: CreatePhotoDto = {
      filename: file.filename,
      originalName: file.originalname,
      description: body.description,
      tags,
      ownerId: user.id,
    };
    return await this.photosService.create(photoDto);
  }

  @Get(':id')
  async getPhoto(@Param('id') id: string) {
    return await this.photosService.findById(id);
  }

  @Get('user/:userId')
  async getPhotosByUser(@Param('userId') userId: string) {
    return await this.photosService.findByOwnerId(userId);
  }

  @Get()
  async getAllPhotos() {
    return await this.photosService.findAll();
  }
}
