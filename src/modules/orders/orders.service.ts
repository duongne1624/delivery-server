import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@entities/order.entity';
import { User } from '@entities/user.entity';
import { OrderItem } from '@entities/order-item.entity';
import { Product } from '@entities/product.entity';
import { OrderResponseDto, UserSummaryDto } from './dto/order-response.dto';
import {
  CreateOrderWithPaymentDto,
  PaymentMethod,
} from './dto/create-order-with-payment.dto';
import { Payment } from '@entities/payment.entity';
import { PaymentsService } from '@modules/payments/payments.service';
import { createVnpayPaymentUrl } from '@common/utils/vnpay.util';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private readonly paymentsService: PaymentsService
  ) {}

  async createWithPayment(
    userId: string,
    dto: CreateOrderWithPaymentDto,
    clientIp: string
  ): Promise<{ order: OrderResponseDto; paymentUrl?: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Tính tổng giá trị
    let total_price = 0;
    const items: OrderItem[] = [];

    for (const itemDto of dto.items) {
      const product = await this.productRepo.findOne({
        where: { id: itemDto.product_id },
      });
      if (!product) throw new NotFoundException('Product not found');

      const item = this.itemRepo.create({
        product,
        quantity: itemDto.quantity,
        price: product.price,
      });

      total_price += product.price * itemDto.quantity;
      items.push(item);
    }

    const order = this.orderRepo.create({
      customer: user,
      delivery_address: dto.delivery_address,
      note: dto.note,
      status: 'pending',
      total_price,
      items,
    });

    const savedOrder = await this.orderRepo.save(order);

    if (dto.payment_method === PaymentMethod.COD) {
      await this.paymentRepo.save({
        method: 'cod',
        status: 'pending',
        amount: total_price,
        order: savedOrder,
      });

      return { order: savedOrder };
    }

    if (dto.payment_method === PaymentMethod.VNPAY) {
      const transaction_id = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      await this.paymentRepo.save({
        method: 'vnpay',
        status: 'pending',
        transaction_id,
        amount: total_price,
        order: savedOrder,
      });

      const paymentUrl = createVnpayPaymentUrl(
        {
          amount: total_price,
          orderDescription: `Thanh toan don hang ${savedOrder.id}`,
          orderId: savedOrder.id,
        },
        clientIp
      );

      return { order: savedOrder, paymentUrl };
    }

    throw new BadRequestException('Phương thức thanh toán không được hỗ trợ');
  }

  async findAll(userId): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { customer: { id: userId } },
      relations: ['items', 'items.product', 'shipper', 'customer'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.mapOrderToDto);
  }

  async findAllOrder(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      relations: ['items', 'items.product', 'shipper', 'customer'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.mapOrderToDto);
  }

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'shipper', 'items', 'items.product'],
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
      relations: ['customer', 'shipper', 'items', 'items.product'],
    });

    if (!shipper || !order) throw new NotFoundException();

    order.shipper = shipper;
    order.status = 'confirmed';
    const saved = await this.orderRepo.save(order);
    return this.mapOrderToDto(saved);
  }

  private mapUserToSummary(user: User): UserSummaryDto {
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
    };
  }

  private mapOrderToDto = (order: Order): OrderResponseDto => {
    return {
      id: order.id,
      total_price: Number(order.total_price),
      status: order.status,
      delivery_address: order.delivery_address,
      note: order.note,
      customer: this.mapUserToSummary(order.customer),
      shipper: order.shipper ? this.mapUserToSummary(order.shipper) : null,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.image,
        },
      })),
    };
  };

  async cancelByUser(
    orderId: string,
    userId: string
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.customer.id !== userId)
      throw new ForbiddenException('Bạn không có quyền hủy đơn này');
    if (order.status !== 'pending')
      throw new ForbiddenException('Chỉ được hủy đơn khi đang chờ xử lý');

    order.status = 'cancelled';
    const saved = await this.orderRepo.save(order);
    return this.mapOrderToDto(saved);
  }

  async completeByShipper(
    orderId: string,
    shipperId: string
  ): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['customer', 'shipper', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    if (order.shipper?.id !== shipperId)
      throw new ForbiddenException('Bạn không được phép xác nhận đơn này');

    order.status = 'completed';
    const saved = await this.orderRepo.save(order);
    return this.mapOrderToDto(saved);
  }
}
