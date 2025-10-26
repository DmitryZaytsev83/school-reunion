import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Photo as SharedPhoto } from '@app/shared/dist/types';

@Entity('photos')
export class Photo implements SharedPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column({ nullable: true })
  description?: string;

  @Column('simple-array') // Массив тегов
  tags: string[];

  @ManyToOne(() => User, { eager: true })
  owner: User;

  @CreateDateColumn()
  uploadedAt: Date;
}
