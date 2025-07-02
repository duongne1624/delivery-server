import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.interface';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Restaurants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly service: RestaurantService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả nhà hàng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách nhà hàng',
    type: [Object],
  })
  async getAll(): Promise<Restaurant[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo nhà hàng mới' })
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({ status: 201, description: 'Nhà hàng đã được tạo' })
  async create(@Body() body: CreateRestaurantDto): Promise<Restaurant> {
    return this.service.create(body);
  }

  @Get('by-owner')
  @ApiOperation({ summary: 'Lấy nhà hàng theo ID chủ sở hữu' })
  @ApiQuery({ name: 'owner_id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Danh sách nhà hàng thuộc chủ sở hữu',
  })
  async getByOwner(@Query('owner_id') owner_id: string) {
    return this.service.findByOwner(owner_id);
  }
}
