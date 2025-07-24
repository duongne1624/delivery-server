import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@entities/order.entity';
import { User } from '@entities/user.entity';
import { Role } from '@common/constants/role.enum';
import { OrdersService } from '../orders/orders.service';
import { OrderResponseDto } from '../orders/dto/order-response.dto';

@Injectable()
export class ShipperService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly ordersService: OrdersService
  ) {}

  // Lấy danh sách các order chưa được nhận
  async getPendingOrders(shipperRole: string): Promise<OrderResponseDto[]> {
    if (shipperRole !== Role.Shipper.toString())
      throw new UnauthorizedException('You not allow to see this.');
    // Gọi ordersService để lấy danh sách đơn chưa nhận
    return this.ordersService.findPendingOrdersForShipper();
  }

  // Đăng ký nhận đơn
  async acceptOrder(
    orderId: string,
    shipperId: string
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper', 'items', 'items.product', 'payment'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'pending' || order.shipper_id)
      throw new BadRequestException('Order is not available');
    order.shipper_id = shipperId;
    order.status = 'delivering';
    order.shipper_confirmed_at = new Date();
    const saved = await this.orderRepo.save(order);
    return this.ordersService['mapOrderToDto'](saved);
  }

  // Xem chi tiết đơn hàng
  async getOrderDetail(orderId: string): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper', 'items', 'items.product', 'payment'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.ordersService['mapOrderToDto'](order);
  }

  // Lấy danh sách đơn hàng đang nhận nhưng chưa giao (đang giao)
  async getMyOrders(shipperId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { shipper_id: shipperId, status: 'delivering' },
      relations: ['items', 'items.product', 'shipper', 'customer', 'payment'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.ordersService['mapOrderToDto']);
  }

  // Lấy danh sách đơn hàng đã giao thành công
  async getDeliveredOrders(shipperId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { shipper_id: shipperId, status: 'completed' },
      relations: ['items', 'items.product', 'shipper', 'customer', 'payment'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.ordersService['mapOrderToDto']);
  }

  // Thống kê shipper: số đơn đã giao, thu nhập ngày, thu nhập tháng, số đơn đang giao
  async getShipperStats(shipperId: string) {
    // Đơn đã giao
    const deliveredOrders = await this.orderRepo.find({
      where: { shipper_id: shipperId, status: 'completed' },
    });
    // Đơn đang giao
    const deliveringOrders = await this.orderRepo.find({
      where: { shipper_id: shipperId, status: 'delivering' },
    });
    // Thu nhập ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveredToday = deliveredOrders.filter((o) => o.updated_at >= today);
    const incomeToday = deliveredToday.reduce(
      (sum, o) => sum + Number(o.total_price),
      0
    );
    // Thu nhập tháng
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const deliveredThisMonth = deliveredOrders.filter(
      (o) => o.updated_at >= firstDayOfMonth
    );
    const incomeMonth = deliveredThisMonth.reduce(
      (sum, o) => sum + Number(o.total_price),
      0
    );
    return {
      deliveredCount: deliveredOrders.length,
      deliveringCount: deliveringOrders.length,
      incomeToday,
      incomeMonth,
    };
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(
    orderId: string,
    status: string,
    shipperId: string
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper', 'items', 'items.product', 'payment'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.shipper_id !== shipperId)
      throw new ForbiddenException('Not your order');
    if (!['delivering', 'completed', 'cancelled'].includes(status))
      throw new BadRequestException('Invalid status');
    order.status = status as any;
    const saved = await this.orderRepo.save(order);
    return this.ordersService['mapOrderToDto'](saved);
  }

  // Lấy thông tin cá nhân shipper
  async getProfile(shipperId: string) {
    const shipper = await this.userRepo.findOne({
      where: { id: shipperId, role: 'shipper' },
    });
    if (!shipper) throw new NotFoundException('Shipper not found');
    return shipper;
  }
}
