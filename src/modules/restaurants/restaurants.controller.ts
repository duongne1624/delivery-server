import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/constants/role.enum';
import { AuthRequest } from '@common/interfaces/auth-request.interface';

@Controller('restaurants')
@ApiTags('Restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({ status: 200, description: 'List of all restaurants' })
  async findAll() {
    return this.restaurantsService.findAll();
  }

  @Get('paginate')
  @ApiOperation({ summary: 'Phân trang danh sách nhà hàng' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async paginate(@Query('page') page = 1, @Query('limit') limit = 10) {
    const [data, total] = await this.restaurantsService.paginate(+page, +limit);
    return {
      data,
      total,
      page: +page,
      limit: +limit,
    };
  }

  @Get('top-selling')
  async getTopSellingRestaurants() {
    return this.restaurantsService.getTopSellingRestaurants();
  }

  @Get('search')
  @ApiQuery({ name: 'keyword', required: true })
  async search(@Query('keyword') keyword: string) {
    return this.restaurantsService.searchRestaurants(keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Restaurant detail by ID' })
  async findOne(@Param('id') id: string) {
    return this.restaurantsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Created restaurant successfully' })
  async create(@Body() dto: CreateRestaurantDto, @Req() req: AuthRequest) {
    return this.restaurantsService.create(dto, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Updated restaurant successfully' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @Req() req: AuthRequest
  ) {
    const restaurant = await this.restaurantsService.findById(id);
    this.ensureCanModify(restaurant, req.user);
    return this.restaurantsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a restaurant (set is_active = false)' })
  @ApiResponse({ status: 200, description: 'Deactivated restaurant' })
  async deactivate(@Param('id') id: string, @Req() req: AuthRequest) {
    const restaurant = await this.restaurantsService.findById(id);
    this.ensureCanModify(restaurant, req.user);
    return this.restaurantsService.update(id, { is_active: false });
  }

  private ensureCanModify(
    restaurant: { created_by_id: string },
    user: AuthRequest['user']
  ) {
    if (restaurant.created_by_id !== user.userId && user.role !== Role.Admin) {
      throw new ForbiddenException(
        'You are not allowed to modify this restaurant'
      );
    }
  }

  @Get('paginate-by-product-category/:categoryId')
  @ApiOperation({ summary: 'Get restaurants with product in category' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getByProductCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const [data, total] =
      await this.restaurantsService.paginateByProductCategory(
        categoryId,
        +page,
        +limit
      );
    return { data, total, page: +page, limit: +limit };
  }
}
