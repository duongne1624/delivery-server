import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from '@entities/user-address.entity';
import { Repository } from 'typeorm';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private addressRepo: Repository<UserAddress>
  ) {}

  async create(user_id: string, dto: CreateUserAddressDto) {
    if (dto.is_default) {
      await this.addressRepo.update({ user_id }, { is_default: false });
    }

    const address = this.addressRepo.create({ ...dto, user_id });
    return this.addressRepo.save(address);
  }

  async findAll(user_id: string) {
    return this.addressRepo.find({
      where: { user_id },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(user_id: string, id: string) {
    const address = await this.addressRepo.findOne({ where: { id, user_id } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(user_id: string, id: string, dto: UpdateUserAddressDto) {
    const address = await this.findOne(user_id, id);

    if (dto.is_default) {
      await this.addressRepo.update({ user_id }, { is_default: false });
    }

    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    const address = await this.addressRepo.findOne({
      where: { id: addressId, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.addressRepo.update({ user_id: userId }, { is_default: false });
    await this.addressRepo.update({ id: addressId }, { is_default: true });
  }

  async getDefaultAddress(userId: string): Promise<UserAddress> {
    const address = await this.addressRepo.findOne({
      where: { user_id: userId, is_default: true },
    });

    if (!address) {
      throw new NotFoundException('Default address not found');
    }

    return address;
  }

  async remove(user_id: string, id: string) {
    const address = await this.findOne(user_id, id);
    return this.addressRepo.remove(address);
  }
}
