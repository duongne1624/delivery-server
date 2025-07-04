import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '@entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>
  ) {}

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepo.find();
  }

  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async create(dto: CreateRestaurantDto, userId: string): Promise<Restaurant> {
    const newRestaurant = this.restaurantRepo.create({
      ...dto,
      created_by_id: userId,
    });
    return this.restaurantRepo.save(newRestaurant);
  }

  async update(id: string, dto: UpdateRestaurantDto): Promise<Restaurant> {
    await this.restaurantRepo.update(id, dto);
    return this.findById(id);
  }

  async deactivate(id: string): Promise<Restaurant> {
    await this.restaurantRepo.update(id, { is_active: false });
    return this.findById(id);
  }
}
