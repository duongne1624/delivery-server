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

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async get(@Query('user_id') user_id: string): Promise<Cart | null> {
    if (!user_id) throw new BadRequestException('Missing user_id');
    return this.cartService.getByUser(user_id);
  }

  @Post()
  async update(@Body() dto: UpdateCartDto): Promise<Cart> {
    return this.cartService.updateOrCreate(dto.user_id, dto.items);
  }

  @Delete()
  async clear(@Query('user_id') user_id: string): Promise<{ message: string }> {
    if (!user_id) throw new BadRequestException('Missing user_id');
    await this.cartService.clearCart(user_id);
    return { message: 'Cart cleared' };
  }
}
