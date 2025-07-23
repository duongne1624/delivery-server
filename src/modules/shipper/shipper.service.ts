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

@Injectable()
export class ShipperService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  // Lấy danh sách các order chưa được nhận
  async getPendingOrders(shipperRole: string) {
    if (shipperRole !== Role.Shipper.toString())
      throw new UnauthorizedException('You not allow to see this.');

    return this.orderRepo.find({
      where: { status: 'pending', shipper_id: undefined },
      order: { created_at: 'DESC' },
    });
  }

  // Đăng ký nhận đơn
  async acceptOrder(orderId: string, shipperId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'pending' || order.shipper_id)
      throw new BadRequestException('Order is not available');
    order.shipper_id = shipperId;
    order.status = 'delivering';
    order.shipper_confirmed_at = new Date();
    await this.orderRepo.save(order);
    return { success: true };
  }

  // Xem chi tiết đơn hàng
  async getOrderDetail(orderId: string) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // Lấy danh sách đơn hàng đã nhận của shipper
  async getMyOrders(shipperId: string) {
    return this.orderRepo.find({
      where: { shipper_id: shipperId },
      order: { created_at: 'DESC' },
    });
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId: string, status: string, shipperId: string) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.shipper_id !== shipperId)
      throw new ForbiddenException('Not your order');
    if (!['delivering', 'completed', 'cancelled'].includes(status))
      throw new BadRequestException('Invalid status');
    order.status = status as any;
    await this.orderRepo.save(order);
    return { success: true };
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
