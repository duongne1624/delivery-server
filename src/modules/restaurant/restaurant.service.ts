import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './restaurant.interface';
import { Model } from 'mongoose';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel('Restaurant') private readonly model: Model<Restaurant>
  ) {}

  async findAll(): Promise<Restaurant[]> {
    return this.model.find().exec();
  }

  async create(data: Partial<Restaurant>): Promise<Restaurant> {
    return this.model.create(data);
  }

  async findByOwner(owner_id: string): Promise<Restaurant[]> {
    return this.model.find({ owner_id }).exec();
  }
}
