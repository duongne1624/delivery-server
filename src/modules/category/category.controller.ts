import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả danh mục' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách danh mục',
    type: [CreateCategoryDto],
  })
  async getAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới danh mục' })
  @ApiResponse({
    status: 201,
    description: 'Danh mục được tạo',
    type: CreateCategoryDto,
  })
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(dto);
  }
}
