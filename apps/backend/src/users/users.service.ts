import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepo.create(userData);
    return await this.usersRepo.save(user);
  }

  async updateById(id: string, updateData: Partial<User>): Promise<User> {
    // ✅ Возвращаем User
    await this.usersRepo.update(id, updateData);
    const updatedUser = await this.findById(id); // ✅ findById возвращает User | undefined
    if (!updatedUser) {
      // ❗️Это маловероятно, но на всякий случай
      throw new Error('User not found after update');
    }
    return updatedUser; // ✅ Возвращаем User
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepo.findOne({ where: { email } });
    return user || undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.usersRepo.findOne({ where: { id } });
    return user || undefined;
  }
}
