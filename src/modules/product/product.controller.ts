import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Trả về danh sách sản phẩm',
    type: [CreateProductDto],
  })
  async getAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Sản phẩm được tạo thành công' })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.create(dto);
  }
}
