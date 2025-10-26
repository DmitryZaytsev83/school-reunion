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
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PhotosService, CreatePhotoDto } from './photos.service';
import type { Request } from 'express';
import { User } from '../users/entities/user.entity';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { description?: string; tags?: string },
    @Req() req: Request, // ✅ Получаем запрос, чтобы извлечь юзера
  ) {
    const user = req.user as User; // ✅ Получаем юзера из JWT
    const tags = body.tags ? body.tags.split(',').map((tag) => tag.trim()) : [];
    const photoDto: CreatePhotoDto = {
      filename: file.filename,
      originalName: file.originalname,
      description: body.description,
      tags,
      ownerId: user.id, // ✅ Используем ID из JWT
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
