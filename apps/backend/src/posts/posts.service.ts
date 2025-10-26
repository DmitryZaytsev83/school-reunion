import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Photo } from '../photos/entities/photo.entity';

export interface CreatePostDto {
  text: string;
  authorId: string;
  photoIds?: string[];
}

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const post = this.postsRepo.create({
      text: dto.text,
      author: { id: dto.authorId } as User,
    });

    if (dto.photoIds && dto.photoIds.length > 0) {
      const photos = await this.getPhotosByIds(dto.photoIds);
      post.photos = photos;
    }

    return await this.postsRepo.save(post);
  }

  async findById(id: string): Promise<Post | undefined> {
    const post = await this.postsRepo.findOne({
      where: { id },
      relations: ['author', 'photos'],
    });
    return post || undefined;
  }

  async findByAuthorId(authorId: string): Promise<Post[]> {
    return await this.postsRepo.find({
      where: { author: { id: authorId } },
      order: { createdAt: 'DESC' },
      relations: ['author', 'photos'],
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['author', 'photos'],
    });
  }

  private async getPhotosByIds(ids: string[]): Promise<Photo[]> {
    const photosRepo = this.postsRepo.manager.getRepository(Photo);
    return await photosRepo.findByIds(ids);
  }
}
