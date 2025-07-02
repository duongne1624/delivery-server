import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.interface';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly service: RestaurantService) {}

  @Get()
  async getAll(): Promise<Restaurant[]> {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() body: Partial<Restaurant>): Promise<Restaurant> {
    return this.service.create(body);
  }

  @Get('by-owner')
  async getByOwner(@Query('owner_id') owner_id: string) {
    return this.service.findByOwner(owner_id);
  }
}
