import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Req,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { OrderDetailResponseDto } from './dto/order-detail-response.dto';

interface AuthRequest extends Request {
  user: { user_id: string };
}

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() req: AuthRequest) {
    return this.service.create({
      ...dto,
      user_id: req.user.user_id,
      status: 'pending',
      created_at: new Date(),
    });
  }

  @Get()
  async getMyOrders(@Req() req: AuthRequest) {
    return this.service.findByUser(req.user.user_id);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string, @Req() req: AuthRequest) {
    const cancelled = await this.service.cancelOrder(id, req.user.user_id);
    if (!cancelled)
      throw new NotFoundException('Order not found or not cancellable');
    return cancelled;
  }

  @Get(':id/detail')
  async getDetail(@Param('id') id: string): Promise<OrderDetailResponseDto> {
    return this.service.getOrderWithDetails(id);
  }
}
