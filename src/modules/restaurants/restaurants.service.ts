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

  async paginate(page = 1, limit = 10): Promise<[Restaurant[], number]> {
    return this.restaurantRepo.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async paginateByProductCategory(
    categoryId: string,
    page = 1,
    limit = 10
  ): Promise<[Restaurant[], number]> {
    const qb = this.restaurantRepo
      .createQueryBuilder('restaurant')
      .innerJoin('restaurant.products', 'product')
      .where('product.category_id = :categoryId', { categoryId })
      .skip((page - 1) * limit)
      .take(limit)
      .groupBy('restaurant.id')
      .addGroupBy('restaurant.name')
      .addGroupBy('restaurant.address')
      .addGroupBy('restaurant.created_at');

    const [data, count] = await qb.getManyAndCount();
    return [data, count];
  }

  async getTopSellingRestaurants(limit = 10) {
    return this.restaurantRepo
      .createQueryBuilder('r')
      .innerJoin('r.products', 'p')
      .innerJoin('p.orderItems', 'oi')
      .innerJoin('oi.order', 'o')
      .where('o.status = :status', { status: 'completed' })
      .select('r.id', 'id')
      .addSelect('r.name', 'name')
      .addSelect('r.image', 'image')
      .addSelect('r.address', 'address')
      .addSelect('COUNT(DISTINCT o.id)', 'total_orders')
      .groupBy('r.id')
      .addGroupBy('r.name')
      .orderBy('total_orders', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
