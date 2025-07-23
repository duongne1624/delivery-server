import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthRequest } from '@common/interfaces/auth-request.interface';

@ApiTags('Shipper')
@Controller('shipper')
@UseGuards(JwtAuthGuard)
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  /**
   * Lấy danh sách các order chưa được nhận
   */
  @Get('orders/pending')
  @ApiOperation({ summary: 'Lấy danh sách các order chưa được nhận' })
  @ApiResponse({ status: 200, description: 'Danh sách order chưa nhận.' })
  getPendingOrders(@Request() req: AuthRequest): Promise<any> {
    return this.shipperService.getPendingOrders(req.user.userId);
  }

  /**
   * Đăng ký nhận đơn
   */
  @Post('orders/:orderId/accept')
  @ApiOperation({ summary: 'Đăng ký nhận đơn' })
  @ApiResponse({ status: 200, description: 'Nhận đơn thành công.' })
  acceptOrder(
    @Param('orderId') orderId: string,
    @Request() req: AuthRequest
  ): Promise<any> {
    return this.shipperService.acceptOrder(orderId, req.user.userId);
  }

  /**
   * Xem chi tiết đơn hàng
   */
  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Xem chi tiết đơn hàng' })
  @ApiResponse({ status: 200, description: 'Chi tiết đơn hàng.' })
  getOrderDetail(@Param('orderId') orderId: string): Promise<any> {
    return this.shipperService.getOrderDetail(orderId);
  }

  /**
   * Lấy danh sách đơn hàng đã nhận của shipper
   */
  @Get('orders/my')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng đã nhận của shipper' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng đã nhận.' })
  getMyOrders(@Request() req: AuthRequest): Promise<any> {
    return this.shipperService.getMyOrders(req.user.userId);
  }

  /**
   * Cập nhật trạng thái đơn hàng (ví dụ: đang giao, đã giao)
   */
  @Patch('orders/:orderId/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công.' })
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
    @Request() req: AuthRequest
  ): Promise<any> {
    return this.shipperService.updateOrderStatus(
      orderId,
      status,
      req.user.userId
    );
  }

  /**
   * Lấy thông tin cá nhân shipper
   */
  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân shipper' })
  @ApiResponse({ status: 200, description: 'Thông tin cá nhân shipper.' })
  getProfile(@Request() req: AuthRequest): Promise<any> {
    return this.shipperService.getProfile(req.user.userId);
  }
}
