import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { User } from '../users/entities/user.entity';

export interface CreatePhotoDto {
  filename: string;
  originalName: string;
  description?: string;
  tags: string[];
  ownerId: string;
}

@Injectable()
export class PhotosService {
  constructor(@InjectRepository(Photo) private photosRepo: Repository<Photo>) {}

  async create(dto: CreatePhotoDto): Promise<Photo> {
    const photo = this.photosRepo.create({
      ...dto,
      owner: { id: dto.ownerId } as User,
    });
    return await this.photosRepo.save(photo);
  }

  async findById(id: string): Promise<Photo | undefined> {
    const photo = await this.photosRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    return photo || undefined; // ✅ Явно возвращаем undefined, если null
  }

  async findByOwnerId(ownerId: string): Promise<Photo[]> {
    return await this.photosRepo.find({
      where: { owner: { id: ownerId } },
      order: { uploadedAt: 'DESC' },
    });
  }

  async findAll(): Promise<Photo[]> {
    return await this.photosRepo.find({
      relations: ['owner'],
      order: { uploadedAt: 'DESC' },
    });
  }
}
