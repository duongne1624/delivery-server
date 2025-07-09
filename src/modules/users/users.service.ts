// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';
import { SafeUser } from './interfaces/safe-user.interface';
import { Role } from '@common/constants/role.enum';
import { Order } from '@entities/order.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>
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

  async getAvailableShippers(): Promise<User[]> {
    const shippers = await this.userRepository.find({
      where: { role: Role.Shipper },
    });

    const busyShipperIdsRaw = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.shipper_id', 'shipperId')
      .where('order.status IN (:...statuses)', {
        statuses: ['confirmed', 'delivering'],
      })
      .andWhere('order.shipper_id IS NOT NULL')
      .groupBy('order.shipper_id')
      .getRawMany();

    const busyShipperIds = busyShipperIdsRaw.map((row) => row.shipperId);

    return shippers.filter((shipper) => !busyShipperIds.includes(shipper.id));
  }
}
