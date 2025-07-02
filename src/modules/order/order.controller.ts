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
import { OrderResponseDto } from './dto/order-response.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Order } from './order.interface';

interface AuthRequest extends Request {
  user: { user_id: string };
}

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  async create(
    @Body() dto: CreateOrderDto,
    @Req() req: AuthRequest
  ): Promise<Order> {
    return this.service.create({
      ...dto,
      user_id: req.user.user_id,
      status: 'pending',
      created_at: new Date(),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'List of user orders',
    type: [OrderResponseDto],
  })
  async getMyOrders(@Req() req: AuthRequest): Promise<Order[]> {
    return this.service.findByUser(req.user.user_id);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found or not cancellable',
  })
  async cancel(
    @Param('id') id: string,
    @Req() req: AuthRequest
  ): Promise<Order> {
    const cancelled = await this.service.cancelOrder(id, req.user.user_id);
    if (!cancelled)
      throw new NotFoundException('Order not found or not cancellable');
    return cancelled;
  }

  @Get(':id/detail')
  @ApiOperation({ summary: 'Xem thông tin đơn hàng' })
  @ApiResponse({
    status: 200,
    description: 'Detailed order information',
    type: OrderDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getDetail(@Param('id') id: string): Promise<OrderDetailResponseDto> {
    return this.service.getOrderWithDetails(id);
  }
}
