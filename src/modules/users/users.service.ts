// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';
import { SafeUser } from './interfaces/safe-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findByPhone(identifier: string): Promise<User | undefined> {
    return (
      (await this.userRepository.findOne({
        where: [{ phone: identifier }],
      })) ?? undefined
    );
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...rest }) => rest);
  }

  async findById(id: string): Promise<SafeUser | undefined> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async update(id: string, data: Partial<User>): Promise<SafeUser> {
    await this.userRepository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
