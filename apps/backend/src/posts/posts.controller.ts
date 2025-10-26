import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService, CreatePostDto } from './posts.service';
import type { Request } from 'express';
import { User } from '../users/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Body() body: { text: string; photoIds?: string[] },
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const dto: CreatePostDto = {
      text: body.text,
      authorId: user.id,
      photoIds: body.photoIds,
    };
    return await this.postsService.create(dto);
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return await this.postsService.findById(id);
  }

  @Get('author/:authorId')
  async getPostsByAuthor(@Param('authorId') authorId: string) {
    return await this.postsService.findByAuthorId(authorId);
  }

  @Get()
  async getAllPosts() {
    return await this.postsService.findAll();
  }
}
