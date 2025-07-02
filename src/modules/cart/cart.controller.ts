import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.interface';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy giỏ hàng theo user_id' })
  @ApiQuery({ name: 'user_id', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Thông tin giỏ hàng',
    type: Object,
  })
  async get(@Query('user_id') user_id: string): Promise<Cart | null> {
    if (!user_id) throw new BadRequestException('Missing user_id');
    return this.cartService.getByUser(user_id);
  }

  @Post()
  @ApiOperation({ summary: 'Cập nhật hoặc tạo mới giỏ hàng' })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({
    status: 201,
    description: 'Giỏ hàng đã được cập nhật hoặc tạo mới',
    type: Object,
  })
  async update(@Body() dto: UpdateCartDto): Promise<Cart> {
    return this.cartService.updateOrCreate(dto.user_id, dto.items);
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa giỏ hàng của người dùng' })
  @ApiQuery({ name: 'user_id', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Đã xóa giỏ hàng' })
  async clear(@Query('user_id') user_id: string): Promise<{ message: string }> {
    if (!user_id) throw new BadRequestException('Missing user_id');
    await this.cartService.clearCart(user_id);
    return { message: 'Cart cleared' };
  }
}
