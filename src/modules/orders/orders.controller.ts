import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
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

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  create(@Body() dto: CreateOrderDto, @Req() req: AuthRequest) {
    return this.ordersService.create(dto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User, Role.Shipper)
  @ApiOperation({ summary: 'List all orders' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  findAllOrder(@Req() req: AuthRequest) {
    const user = req.user;

    const isAdmin = user.role === Role.Admin;

    if (!isAdmin) {
      throw new ForbiddenException('You are not allowed to view this list');
    }

    return this.ordersService.findAllOrder();
  }

  @Get('get-by-user')
  @ApiOperation({ summary: 'List all orders of User' })
  @ApiResponse({ status: 200, description: 'List of all categories' })
  findAll(@Req() req: AuthRequest) {
    return this.ordersService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User, Role.Shipper)
  @ApiBearerAuth()
  async getOrderById(@Param('id') id: string, @Req() req: AuthRequest) {
    const order = await this.ordersService.findById(id);

    const user = req.user;

    const isOwner = order.customer?.id === user.userId;
    console.log(user.userId);
    const isAdmin = user.role === Role.Admin;
    const isShipper = order.shipper?.id === user.userId;

    console.log(
      `isOwner: ${isOwner}, isAdmin: ${isAdmin}, isShipper: ${isShipper}`
    );

    if (!isOwner && !isAdmin && !isShipper) {
      throw new ForbiddenException('You are not allowed to view this order');
    }

    return order;
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
