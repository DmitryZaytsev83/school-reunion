import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
// import { User as SharedUser } from '@app/shared'; // ❌ Убираем, чтобы избежать проблем с implements

@Entity('users')
export class User /* implements SharedUser */ {
  // ❌ Убираем implements, если есть проблемы
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  // ✅ Новое поле: аватар
  @Column({ nullable: true })
  avatar?: string;

  @CreateDateColumn()
  createdAt: Date;
}
