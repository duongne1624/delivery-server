import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { RestaurantsService } from '@modules/restaurants/restaurants.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Role } from '@common/constants/role.enum';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { AuthRequest } from '@common/interfaces/auth-request.interface';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly restaurantsService: RestaurantsService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('top-selling')
  @ApiOperation({ summary: 'Get top 10 selling products' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getTopSellingProducts(@Query('limit') limit = 10) {
    return this.productsService.getTopSellingProducts(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() dto: CreateProductDto, @Req() req: AuthRequest) {
    const restaurant = await this.restaurantsService.findById(
      dto.restaurant_id
    );

    if (
      restaurant.created_by_id !== req.user.userId &&
      req.user.role !== Role.Admin
    ) {
      throw new ForbiddenException(
        'You are not allowed to add product to this restaurant'
      );
    }

    return this.productsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiResponse({ status: 200, description: 'Updated product' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: AuthRequest
  ) {
    const product = await this.productsService.findById(id);

    if (
      product.restaurant.created_by_id !== req.user.userId &&
      req.user.role !== Role.Admin
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this product'
      );
    }

    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  async delete(@Param('id') id: string, @Req() req: AuthRequest) {
    const product = await this.productsService.findById(id);

    if (
      product.restaurant.created_by_id !== req.user.userId &&
      req.user.role !== Role.Admin
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this product'
      );
    }

    return this.productsService.delete(id);
  }
}
