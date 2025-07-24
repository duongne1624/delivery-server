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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthRequest } from '@common/interfaces/auth-request.interface';
import { OrderResponseDto } from '@modules/orders/dto/order-response.dto';

@ApiTags('Shipper')
@Controller('shipper')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  /**
   * Lấy thống kê của shipper
   */
  @Get('stats')
  @ApiOperation({ summary: 'Lấy thống kê của shipper' })
  @ApiResponse({ status: 200, description: 'Thống kê của shipper.' })
  getShipperStats(@Request() req: AuthRequest): Promise<any> {
    return this.shipperService.getShipperStats(req.user.userId);
  }

  /**
   * Lấy danh sách các order chưa được nhận
   */
  @Get('orders/pending')
  @ApiOperation({ summary: 'Lấy danh sách các order chưa được nhận' })
  @ApiResponse({ status: 200, description: 'Danh sách order chưa nhận.' })
  getPendingOrders(@Request() req: AuthRequest): Promise<OrderResponseDto[]> {
    return this.shipperService.getPendingOrders(req.user.role);
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
  ): Promise<OrderResponseDto> {
    return this.shipperService.acceptOrder(orderId, req.user.userId);
  }

  /**
   * Lấy danh sách đơn hàng đã nhận của shipper
   */
  @Get('orders/my')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng đã nhận của shipper' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng đã nhận.' })
  getMyOrders(@Request() req: AuthRequest): Promise<OrderResponseDto[]> {
    return this.shipperService.getMyOrders(req.user.userId);
  }

  /**
   * Xem chi tiết đơn hàng
   */
  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Xem chi tiết đơn hàng' })
  @ApiResponse({ status: 200, description: 'Chi tiết đơn hàng.' })
  getOrderDetail(@Param('orderId') orderId: string): Promise<OrderResponseDto> {
    return this.shipperService.getOrderDetail(orderId);
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
  ): Promise<OrderResponseDto> {
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
