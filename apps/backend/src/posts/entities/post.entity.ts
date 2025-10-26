import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Photo } from '../../photos/entities/photo.entity';
import { Post as SharedPost } from '@app/shared/dist/types';

@Entity('posts')
export class Post implements SharedPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToMany(() => Photo, { eager: true })
  @JoinTable()
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;
}
