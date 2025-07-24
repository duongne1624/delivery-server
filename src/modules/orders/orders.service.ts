import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Order } from '@entities/order.entity';
import { User } from '@entities/user.entity';
import { OrderItem } from '@entities/order-item.entity';
import { Product } from '@entities/product.entity';
import {
  OrderResponseDto,
  PaymentSummaryDto,
  UserSummaryDto,
} from './dto/order-response.dto';
import {
  CreateOrderWithPaymentDto,
  PaymentMethod,
} from './dto/create-order-with-payment.dto';
import { Payment } from '@entities/payment.entity';
import { PaymentsService } from '@modules/payments/payments.service';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';
import { UserAddressService } from '@modules/user-address/user-address.service';
import { UserAddress } from '@entities/user-address.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private paymentsService: PaymentsService,
    private readonly userAddressService: UserAddressService,
    private readonly notificationGateway: NotificationsGateway
  ) {}

  async createWithPayment(
    userId: string,
    dto: CreateOrderWithPaymentDto,
    clientIp: string
  ): Promise<{ paymentUrl?: string; order?: OrderResponseDto }> {
    // Validate user
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Validate address
    if (dto.address_id) {
      const address = await this.userAddressService.findOne(
        user.id,
        dto.address_id
      );

      dto.delivery_address = address.address;
      dto.delivery_latitude = address.latitude;
      dto.delivery_longitude = address.longitude;
      dto.delivery_place_id = address.place_id;
    }
    // Tính tổng giá trị và tạo items (chỉ để tính tiền, chưa lưu DB)
    let total_price = 0;
    for (const itemDto of dto.items) {
      if (itemDto.quantity <= 0) {
        throw new BadRequestException('Số lượng sản phẩm phải lớn hơn 0');
      }
      const product = await this.productRepo.findOne({
        where: { id: itemDto.product_id },
      });
      if (!product)
        throw new NotFoundException(`Product ${itemDto.product_id} not found`);
      total_price += product.price * itemDto.quantity;
    }

    if (dto.payment_method === PaymentMethod.COD) {
      // Tạo order luôn cho COD
      const order = await this.createOrderCOD(user, dto, total_price);
      if (!order) throw new BadRequestException('Tạo đơn hàng thất bại');

      // Gửi thông báo cho user
      await this.sendOrderCreatedNotification(order);

      return { order: this.mapOrderToDto(order) };
    }

    // Nếu là online, chỉ tạo payment, chưa tạo order
    const { paymentUrl } = await this.paymentsService.createPayment(
      null,
      dto.payment_method,
      clientIp,
      {
        userId: user.id,
        items: dto.items,
        delivery_address: dto.delivery_address,
        note: dto.note,
        delivery_latitude: dto.delivery_latitude,
        delivery_longitude: dto.delivery_longitude,
        delivery_place_id: dto.delivery_place_id,
        total_price,
      }
    );

    return {
      paymentUrl,
    };
  }

  // Gửi thông báo khi tạo đơn hàng thành công (COD)
  private async sendOrderCreatedNotification(order: Order) {
    // Gửi socket tới user qua NotificationGateway
    await this.notificationGateway.sendNotification(order.customer_id, {
      title: 'Đặt đơn hàng thành công',
      body: `Đơn hàng #${order.id} đã được tạo thành công!`,
      status: 1,
      time: new Date(),
      read: false,
      orderId: order.id,
    });
  }

  // Hàm tạo order cho COD
  private async createOrderCOD(
    user: User,
    dto: CreateOrderWithPaymentDto,
    total_price: number
  ): Promise<Order> {
    // Tạo order entity

    const order = this.orderRepo.create({
      customer_id: user.id,
      delivery_address: dto.delivery_address,
      delivery_latitude: dto.delivery_latitude,
      delivery_longitude: dto.delivery_longitude,
      delivery_place_id: dto.delivery_place_id,
      note: dto.note,
      status: 'pending',
      total_price,
    });
    const savedOrder = await this.orderRepo.save(order);

    // Tạo order items
    for (const itemDto of dto.items) {
      const product = await this.productRepo.findOne({
        where: { id: itemDto.product_id },
      });
      if (!product)
        throw new NotFoundException(`Product ${itemDto.product_id} not found`);
      const item = this.itemRepo.create({
        order: savedOrder,
        product: product,
        quantity: itemDto.quantity,
        price: product.price,
      });
      await this.itemRepo.save(item);
    }

    // Tạo payment entity cho COD
    const payment = this.paymentRepo.create({
      order: savedOrder,
      method: 'cod',
      status: 'pending',
      amount: total_price,
    });
    await this.paymentRepo.save(payment);

    // Lấy lại order với relations
    const fullOrder = await this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product', 'customer', 'shipper', 'payment'],
    });
    if (!fullOrder)
      throw new NotFoundException('Không tìm thấy đơn hàng sau khi tạo');
    return fullOrder;
  }

  // Lấy các đơn đã hoàn thành hoặc đã hủy của user
  async findCompletedOrCancelledOrders(
    userId: string
  ): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: [
        { customer: { id: userId }, status: 'completed' },
        { customer: { id: userId }, status: 'cancelled' },
      ],
      relations: ['items', 'items.product', 'shipper', 'customer', 'payment'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.mapOrderToDto);
  }

  // Lấy các đơn hiện tại (chưa hoàn thành hoặc hủy) của user
  async findCurrentOrders(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: {
        customer: { id: userId },
        status: Not('completed'),
      },
      relations: ['items', 'items.product', 'shipper', 'customer', 'payment'],
      order: { created_at: 'DESC' },
    });
    // Loại bỏ đơn đã hủy
    const filtered = orders.filter((o) => o.status !== 'cancelled');
    return filtered.map(this.mapOrderToDto);
  }

  async findAllOrder(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      relations: ['items', 'items.product', 'shipper', 'customer', 'payment'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.mapOrderToDto);
  }

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'shipper', 'items', 'items.product', 'payment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.mapOrderToDto(order);
  }

  async delete(id: string): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    await this.itemRepo.remove(order.items);
    await this.orderRepo.remove(order);
  }

  async assignShipper(
    orderId: string,
    shipperId: string
  ): Promise<OrderResponseDto> {
    const shipper = await this.userRepo.findOneBy({ id: shipperId });
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper', 'items', 'items.product', 'payment'],
    });

    if (!shipper || !order) throw new NotFoundException();

    order.shipper = shipper;
    order.shipper_id = shipper.id;
    order.status = 'confirmed';
    order.shipper_confirmed_at = new Date();
    const saved = await this.orderRepo.save(order);
    return this.mapOrderToDto(saved);
  }

  async findPendingOrdersForShipper(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { status: 'pending', shipper_id: IsNull() },
      relations: ['items', 'items.product', 'shipper', 'customer', 'payment'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.mapOrderToDto);
  }

  private mapUserToSummary(user: User): UserSummaryDto {
    if (!user) {
      return { id: '', name: '', phone: '' };
    }
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
    };
  }

  private mapPaymentToSummary(payment: Payment): PaymentSummaryDto {
    if (!payment) {
      return {
        method: 'cod',
        transaction_id: '',
        status: 'pending',
        amount: 0,
      };
    }
    return {
      method: payment.method,
      transaction_id: payment.transaction_id ?? '',
      status: payment.status,
      amount: payment.amount,
    };
  }

  private mapOrderToDto = (order: Order): OrderResponseDto => {
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return {
      id: order.id,
      total_price: Number(order.total_price),
      status: order.status,
      delivery_address: order.delivery_address,
      delivery_latitude: order.delivery_latitude
        ? Number(order.delivery_latitude)
        : undefined,
      delivery_longitude: order.delivery_longitude
        ? Number(order.delivery_longitude)
        : undefined,
      delivery_place_id: order.delivery_place_id,
      note: order.note,
      customer: this.mapUserToSummary(order.customer),
      shipper: order.shipper ? this.mapUserToSummary(order.shipper) : undefined,
      shipper_confirmed_at: order.shipper_confirmed_at?.toISOString(),
      cancel_reason: order.cancel_reason,
      items: Array.isArray(order.items)
        ? order.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: Number(item.price),
            product: {
              id: item.product.id,
              name: item.product.name,
              price: Number(item.product.price),
              image: item.product.image,
            },
          }))
        : [],
      payment: order.payment
        ? this.mapPaymentToSummary(order.payment)
        : {
            method: 'cod',
            transaction_id: '',
            status: 'pending',
            amount: 0,
          },
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  };

  async cancelByUser(
    orderId: string,
    userId: string
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper', 'items', 'items.product', 'payment'],
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.customer.id !== userId)
      throw new ForbiddenException('Bạn không có quyền hủy đơn này');
    if (order.status !== 'pending')
      throw new ForbiddenException('Chỉ được hủy đơn khi đang chờ xử lý');

    order.status = 'cancelled';
    order.cancel_reason = 'Khách hủy đơn';
    const saved = await this.orderRepo.save(order);
    return this.mapOrderToDto(saved);
  }

  async completeByShipper(
    orderId: string,
    shipperId: string
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper', 'items', 'items.product', 'payment'],
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.shipper?.id !== shipperId)
      throw new ForbiddenException('Bạn không được phép xác nhận đơn này');

    order.status = 'completed';
    const saved = await this.orderRepo.save(order);
    return this.mapOrderToDto(saved);
  }
}
