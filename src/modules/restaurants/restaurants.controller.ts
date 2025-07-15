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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/constants/role.enum';
import { AuthRequest } from '@common/interfaces/auth-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';

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
      data: {
        data,
        total,
        page: +page,
        limit: +limit,
      },
    };
  }

  @Get('top-selling')
  @ApiOperation({ summary: 'Phân trang danh sách top các nhà hàng' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getTopSellingRestaurants(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const result = await this.restaurantsService.getTopSellingRestaurants(
      +page,
      +limit
    );

    return {
      success: true,
      data: result,
      message: 'Success',
    };
  }

  @Get('search')
  @ApiQuery({ name: 'keyword', required: true })
  async search(@Query('keyword') keyword: string) {
    return this.restaurantsService.searchRestaurants(keyword);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Lấy danh sách món ăn của nhà hàng' })
  @ApiParam({ name: 'id', description: 'ID của nhà hàng', example: 'uuid-123' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getProductsByRestaurant(
    @Param('id') restaurantId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const result = await this.restaurantsService.getProductsByRestaurant(
      restaurantId,
      +page,
      +limit
    );

    return {
      success: true,
      data: result,
      message: 'Success',
    };
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new restaurant',
    type: CreateRestaurantDto,
  })
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Created restaurant successfully' })
  async create(
    @Body() dto: CreateRestaurantDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest
  ) {
    return this.restaurantsService.create(dto, req.user.userId, file);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update a restaurant by ID',
    type: UpdateRestaurantDto,
  })
  @ApiOperation({ summary: 'Update a restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Updated restaurant successfully' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest
  ) {
    const restaurant = await this.restaurantsService.findById(id);
    this.ensureCanModify(restaurant, req.user);
    return this.restaurantsService.update(id, dto, file);
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
