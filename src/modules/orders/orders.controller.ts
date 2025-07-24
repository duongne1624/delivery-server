import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@common/constants/role.enum';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { AuthRequest } from '@common/interfaces/auth-request.interface';
import { OrderResponseDto } from './dto/order-response.dto';
import { CreateOrderWithPaymentDto } from './dto/create-order-with-payment.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng + thanh toán' })
  @UseGuards(JwtAuthGuard)
  async createWithPayment(
    @Body() dto: CreateOrderWithPaymentDto,
    @Req() req: AuthRequest
  ) {
    const reqIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const ip = (typeof reqIp === 'string' ? reqIp : reqIp[0]).replace(
      '::ffff:',
      ''
    );
    const result = await this.ordersService.createWithPayment(
      req.user.userId,
      dto,
      ip
    );
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User, Role.Shipper)
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  findAllOrder(@Req() req: AuthRequest): Promise<OrderResponseDto[]> {
    const user = req.user;

    const isAdmin = user.role === Role.Admin;

    if (!isAdmin) {
      throw new ForbiddenException('You are not allowed to view this list');
    }

    return this.ordersService.findAllOrder();
  }

  @Get('get-history')
  @ApiOperation({
    summary: 'Lấy danh sách đơn đã hoàn thành hoặc đã hủy của user',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đơn đã hoàn thành hoặc đã hủy',
  })
  getHistoryOrders(@Req() req: AuthRequest): Promise<OrderResponseDto[]> {
    return this.ordersService.findCompletedOrCancelledOrders(req.user.userId);
  }

  @Get('get-current')
  @ApiOperation({
    summary: 'Lấy danh sách đơn hiện tại của user (chưa hoàn thành hoặc hủy)',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đơn hiện tại',
  })
  getCurrentOrders(@Req() req: AuthRequest): Promise<OrderResponseDto[]> {
    return this.ordersService.findCurrentOrders(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User, Role.Shipper)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by Id' })
  async getOrderById(
    @Param('id') id: string,
    @Req() req: AuthRequest
  ): Promise<OrderResponseDto> {
    const order = await this.ordersService.findById(id);

    const user = req.user;

    const isOwner = order.customer?.id === user.userId;
    const isAdmin = user.role === Role.Admin;
    const isShipper = order.shipper?.id === user.userId;

    if (!isOwner && !isAdmin && !isShipper) {
      throw new ForbiddenException('You are not allowed to view this order');
    }

    return order;
  }

  @Patch(':id/cancel-by-user')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Canceled order by user with pending status' })
  @ApiResponse({ status: 204, description: 'Order info' })
  async cancelByUser(@Param('id') orderId: string, @Req() req: AuthRequest) {
    return this.ordersService.cancelByUser(orderId, req.user.userId);
  }

  @Patch(':id/complete-by-shipper')
  @Roles(Role.Shipper)
  @ApiOperation({ summary: 'Confirm order is completed' })
  @ApiResponse({ status: 204, description: 'Order info' })
  async completeByShipper(
    @Param('id') orderId: string,
    @Req() req: AuthRequest
  ) {
    return this.ordersService.completeByShipper(orderId, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete order by Id' })
  @ApiResponse({ status: 204, description: 'Delete order success' })
  @ApiResponse({
    status: 403,
    description: 'You are not allowed to delete this order',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async deleteOrder(
    @Param('id') id: string,
    @Req() req: AuthRequest
  ): Promise<void> {
    const order = await this.ordersService.findById(id);

    if (req.user.role !== Role.Admin && order.customer.id !== req.user.userId) {
      throw new ForbiddenException('You are not allowed to delete this order');
    }

    await this.ordersService.delete(id);
  }
}
