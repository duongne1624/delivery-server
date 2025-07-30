import {
  Injectable,
  BadRequestException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '@entities/payment.entity';
import { Order } from '@entities/order.entity';
import { createVnpayPaymentUrl } from '@common/payment-gateway/vnpay.payment';
import { createMomoPaymentUrl } from '@common/payment-gateway/momo.payment';
import { createZaloPayPaymentUrl } from '@common/payment-gateway/zalopay.payment';
import { RedisService } from '@shared/redis/redis.service';
import { OrdersService } from '@modules/orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @Inject(forwardRef(() => OrdersService))
    private readonly orderService: OrdersService,
    private httpService: HttpService,
    private redis: RedisService
  ) {}
  async createPayment(
    order: Order | null,
    method: 'momo' | 'vnpay' | 'zalopay',
    clientIp: string,
    metadata?: {
      userId?: string;
      items?: any[];
      delivery_address?: string;
      note?: string;
      delivery_latitude?: number;
      delivery_longitude?: number;
      delivery_place_id?: string;
      total_price?: number;
      return_url?: string;
    }
  ): Promise<{ payment: Payment; paymentUrl?: string }> {
    const amount = order ? order.total_price : metadata?.total_price || 0;
    const now = new Date(Date.now());

    const year = now.getFullYear().toString().slice(-2);
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);

    const formattedDate = `${year}${month}${day}`;

    const orderId = order
      ? order.id
      : `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const orderDescription = order
      ? `Thanh toan don hang ${order.id}`
      : 'Thanh toan don hang';

    let payment = this.paymentRepo.create({
      method,
      status: 'pending',
      amount,
      order: order || undefined,
    });

    let paymentUrl: string | undefined;

    payment.transaction_id = `${formattedDate}_${orderId}`;
    payment = await this.paymentRepo.save(payment);

    if (!order && metadata) {
      const redisKey = `pending_order:${payment.transaction_id}`;
      await this.redis.set(redisKey, JSON.stringify(metadata), 24 * 60 * 60);
    }

    switch (method) {
      case 'vnpay':
        paymentUrl = createVnpayPaymentUrl(
          {
            amount,
            orderDescription,
            orderId,
          },
          clientIp
        );
        break;
      case 'momo':
        paymentUrl = createMomoPaymentUrl(
          {
            amount,
            orderDescription,
            orderId,
          },
          clientIp
        );
        break;
      case 'zalopay': {
        paymentUrl = await createZaloPayPaymentUrl(
          {
            amount,
            orderDescription,
            orderId,
            return_url: metadata?.return_url,
          },
          clientIp,
          this.httpService
        );
        payment = await this.paymentRepo.save(payment);
        break;
      }
      default:
        throw new BadRequestException(
          'Phương thức thanh toán không được hỗ trợ'
        );
    }

    return { payment, paymentUrl };
  }

  async updatePaymentStatus(appTransId: string, status: number): Promise<void> {
    const payment = await this.paymentRepo.findOne({
      where: { transaction_id: appTransId },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment not found for app_trans_id: ${appTransId}`
      );
    }

    const redisKey = `pending_order:${appTransId}`;

    // Lấy dữ liệu từ Redis
    const orderDataString = await this.redis.get(redisKey);
    if (!orderDataString) {
      throw new NotFoundException('Pending order not found or expired');
    }

    // Parse dữ liệu
    const orderData = JSON.parse(orderDataString);

    console.log(orderData);

    await this.orderService.createOrder(redisKey, payment.id);

    payment.status = status === 1 ? 'success' : 'failed';
    await this.paymentRepo.save(payment);
  }
}
