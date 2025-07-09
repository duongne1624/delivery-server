import { NotificationsGateway } from '@common/gateway/notifications.gateway';
import { OrdersService } from '@modules/orders/orders.service';
import { UsersService } from '@modules/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '@shared/redis/redis.service';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly redisService: RedisService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService
  ) {}

  async assignToNearestShipper(orderId: string) {
    const order = await this.ordersService.findById(orderId);
    const availableShippers = await this.usersService.getAvailableShippers();

    for (const shipper of availableShippers) {
      const assigned = await this.redisService.get(`order_assigned_${orderId}`);
      if (assigned) return;

      this.notificationsGateway.sendToShipper(shipper.id, {
        orderId,
        delivery_address: order.delivery_address,
        total_price: order.total_price,
      });

      // Đợi phản hồi trong 10s
      const result = await this.waitShipperResponse(orderId, shipper.id, 10000);
      if (result === 'accepted') {
        await this.ordersService.assignShipper(orderId, shipper.id);
        return;
      }
    }

    throw new NotFoundException('No available shipper accepted the order');
  }

  async waitShipperResponse(
    orderId: string,
    shipperId: string,
    timeoutMs: number
  ): Promise<string | null> {
    const key = `order_response_${orderId}_${shipperId}`;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const response = await this.redisService.get(key);
      if (response) return response;
      await new Promise((res) => setTimeout(res, 1000));
    }

    return null;
  }

  async confirmAssignment(orderId: string, shipperId: string) {
    // Cập nhật đơn hàng với shipper đã nhận
    return this.ordersService.assignShipper(orderId, shipperId);
  }
}
