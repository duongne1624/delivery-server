import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Addon } from './addon.interface';
import { Model } from 'mongoose';
import { CreateAddonDto } from './dto/create-addon.dto';
import { Restaurant } from '../restaurant/restaurant.interface';

@Injectable()
export class AddonService {
  constructor(
    @InjectModel('Addon') private readonly model: Model<Addon>,
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<Restaurant>
  ) {}

  async create(dto: CreateAddonDto): Promise<Addon> {
    return this.model.create({
      ...dto,
      created_at: new Date(),
    });
  }

  async findByRestaurant(restaurant_id: string): Promise<Addon[]> {
    return this.model.find({ restaurant_id }).exec();
  }

  async checkRestaurantOwnership(
    user_id: string,
    restaurant_id: string
  ): Promise<boolean> {
    const restaurant = await this.restaurantModel.findOne({
      _id: restaurant_id,
    });
    return restaurant?.owner_id === user_id;
  }
}
