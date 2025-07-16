// payments.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';
import { AppConfig } from '@config/app.config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '@entities/payment.entity';
import { Order } from '@entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>
  ) {}

  async verifyVnpayPayment(query: any) {
    const vnpSecureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const sortedQuery = Object.keys(query)
      .sort()
      .map((key) => `${key}=${query[key]}`)
      .join('&');

    const signData = AppConfig.vnpay.VNP_HASHSECRET + sortedQuery;
    const calculatedHash = createHash('sha256')
      .update(signData, 'utf-8')
      .digest('hex');

    // ✅ So sánh mã hash
    if (calculatedHash !== vnpSecureHash) {
      throw new BadRequestException('Sai chữ ký xác minh thanh toán');
    }

    const orderId = query.vnp_TxnRef;
    const paymentStatus = query.vnp_ResponseCode;

    // ✅ 00: Thành công
    if (paymentStatus === '00') {
      const order = await this.orderRepo.findOne({
        where: { id: orderId },
        relations: ['payment'],
      });

      if (!order) {
        throw new BadRequestException('Không tìm thấy đơn hàng');
      }

      order.payment.status = 'success';
      order.payment.transaction_id = query.vnp_TransactionNo;

      await this.paymentRepo.save(order.payment);
      await this.orderRepo.save(order);

      return { success: true, message: 'Thanh toán thành công' };
    } else {
      return { success: false, message: 'Thanh toán thất bại' };
    }
  }
}
