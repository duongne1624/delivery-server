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
import { createVnpayPaymentUrl } from '@common/payment-gateway/vnpay.payment';
import { createMomoPaymentUrl } from '@common/payment-gateway/momo.payment';
import { createZaloPayPaymentUrl } from '@common/payment-gateway/zalopay.payment';

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
    private paymentRepo: Repository<Payment>
  ) {}

  async createWithPayment(
    userId: string,
    dto: CreateOrderWithPaymentDto,
    clientIp: string
  ): Promise<{ order: OrderResponseDto; paymentUrl?: string }> {
    console.log(
      `Creating order for user ${userId} with payment method ${dto.payment_method}`
    );

    // Validate user
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Tính tổng giá trị và tạo items
    let total_price = 0;
    const items: OrderItem[] = [];

    for (const itemDto of dto.items) {
      if (itemDto.quantity <= 0) {
        throw new BadRequestException('Số lượng sản phẩm phải lớn hơn 0');
      }
      const product = await this.productRepo.findOne({
        where: { id: itemDto.product_id },
      });
      if (!product)
        throw new NotFoundException(`Product ${itemDto.product_id} not found`);

      const item = this.itemRepo.create({
        product,
        quantity: itemDto.quantity,
        price: product.price,
      });

      total_price += product.price * itemDto.quantity;
      items.push(item);
    }

    // Tạo đơn hàng
    const order = this.orderRepo.create({
      customer: user,
      delivery_address: dto.delivery_address,
      note: dto.note,
      status: 'pending',
      total_price,
      items,
    });

    const savedOrder = await this.orderRepo.save(order);
    console.log('Saved Order:', savedOrder);

    // Tạo thanh toán
    const payment = this.paymentRepo.create({
      method: dto.payment_method,
      status: 'pending',
      amount: total_price,
      order: savedOrder,
    });

    let paymentUrl: string | undefined;

    switch (dto.payment_method) {
      case PaymentMethod.COD:
        await this.paymentRepo.save(payment);
        break;
      case PaymentMethod.VNPAY:
        payment.transaction_id = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        await this.paymentRepo.save(payment);
        paymentUrl = createVnpayPaymentUrl(
          {
            amount: total_price,
            orderDescription: `Thanh toan don hang ${savedOrder.id}`,
            orderId: savedOrder.id,
          },
          clientIp
        );
        break;
      case PaymentMethod.MOMO:
        payment.transaction_id = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        await this.paymentRepo.save(payment);
        paymentUrl = createMomoPaymentUrl(
          {
            amount: total_price,
            orderDescription: `Thanh toan don hang ${savedOrder.id}`,
            orderId: savedOrder.id,
          },
          clientIp
        );
        break;
      case PaymentMethod.ZALOPAY:
        payment.transaction_id = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        await this.paymentRepo.save(payment);
        paymentUrl = createZaloPayPaymentUrl(
          {
            amount: total_price,
            orderDescription: `Thanh toan don hang ${savedOrder.id}`,
            orderId: savedOrder.id,
          },
          clientIp
        );
        break;
      default:
        throw new BadRequestException(
          'Phương thức thanh toán không được hỗ trợ'
        );
    }

    console.log('Payment URL:', paymentUrl);

    return {
      order: {
        id: savedOrder.id,
        total_price: savedOrder.total_price,
        status: savedOrder.status,
        delivery_address: savedOrder.delivery_address,
        note: savedOrder.note,
        customer: savedOrder.customer,
        shipper: savedOrder.shipper,
        items: savedOrder.items,
        payment: {
          method: payment.method,
          status: payment.status,
          transaction_id: payment.transaction_id,
          amount: payment.amount,
        },
        created_at: savedOrder.created_at,
        updated_at: savedOrder.updated_at,
      },
      paymentUrl,
    };
  }

  async findAll(userId): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { customer: { id: userId } },
      relations: ['items', 'items.product', 'shipper', 'customer', 'payment'],
      order: { created_at: 'DESC' },
    });
    return orders.map(this.mapOrderToDto);
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

  private mapPaymentToSummary(payment: Payment): PaymentSummaryDto {
    return {
      method: payment.method,
      transaction_id: payment.transaction_id,
      status: payment.status,
      amount: payment.amount,
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
      payment: this.mapPaymentToSummary(order.payment),
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
