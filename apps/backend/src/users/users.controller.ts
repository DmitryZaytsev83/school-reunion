import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import type { Request } from 'express'; // ✅ Используем import type для Request

// ✅ Функция для генерации имени файла аватара
export const editFileNameAvatar = (
  req: Request,
  file: Express.Multer.File,
  callback: any,
) => {
  const user = (req as any).user as User;
  const name = 'avatar-' + user.id; // Имя файла: avatar-<id_пользователя>
  const extension = file.originalname.split('.').pop();
  callback(null, `${name}.${extension}`);
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Новый маршрут: GET /users/me (ОПРЕДЕЛЯЕМ РАНЬШЕ /:id!)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const user = (req as any).user as User;
    return await this.usersService.findById(user.id);
  }

  // ✅ Новый маршрут: PATCH /users/me (ОПРЕДЕЛЯЕМ РАНЬШЕ /:id!)
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: join(__dirname, '../../../../uploads'), // Папка uploads
        filename: editFileNameAvatar, // Используем функцию для аватара
      }),
      // Ограничим тип файла, если нужно
      fileFilter: (req: Request, file, cb) => {
        const user = (req as any).user as User;
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Только изображения разрешены!'), false);
        }
      },
    }),
  )
  async updateCurrentUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { firstName?: string; lastName?: string },
    @Req() req: Request,
  ) {
    const user = (req as any).user as User;

    const updateData: Partial<User> = {};
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (file) updateData.avatar = file.filename; // Сохраняем имя файла аватара

    return await this.usersService.updateById(user.id, updateData);
  }

  // ✅ Этот маршрут теперь будет обрабатывать всё, кроме 'me'
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User | undefined> {
    return await this.usersService.findById(id);
  }
}
