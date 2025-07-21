import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { createHmac } from 'crypto';
import { AppConfig } from '@config/app.config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '@entities/payment.entity';
import { Order } from '@entities/order.entity';
import { format } from 'date-fns-tz';

// Interface cho kết quả tra cứu
interface TransactionStatus {
  isValid: boolean;
  transactionId: string;
  status: string;
  message: string;
}

// Interface cho handler tra cứu
interface PaymentQueryHandler {
  queryTransaction(
    orderId: string,
    transactionId: string
  ): Promise<TransactionStatus>;
}

// Handler cho VNPay
class VNPayQueryHandler implements PaymentQueryHandler {
  constructor(
    private config: typeof AppConfig.vnpay,
    private httpService: HttpService
  ) {}

  async queryTransaction(
    orderId: string,
    transactionId: string
  ): Promise<TransactionStatus> {
    const { VNP_TMNCODE, VNP_HASHSECRET, VNP_URL } = this.config;
    const vnp_TxnRef = orderId;
    const vnp_RequestId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const vnp_Version = '2.1.0';
    const vnp_Command = 'querydr';
    const vnp_OrderInfo = `Tra cuu giao dich ${orderId}`;
    const vnp_IpAddr = '127.0.0.1';
    const vnp_CreateDate = format(new Date(), 'yyyyMMddHHmmss', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    const vnp_TransactionDate = format(new Date(), 'yyyyMMddHHmmss', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });

    const params: Record<string, string> = {
      vnp_TmnCode: VNP_TMNCODE,
      vnp_RequestId,
      vnp_Version,
      vnp_Command,
      vnp_TxnRef,
      vnp_OrderInfo,
      vnp_IpAddr,
      vnp_CreateDate,
      vnp_TransactionDate,
    };

    const sortedParams = Object.keys(params)
      .sort()
      .reduce((obj: Record<string, string>, key) => {
        obj[key] = params[key];
        return obj;
      }, {});

    const signData = Object.keys(sortedParams)
      .map((key) => `${key}=${sortedParams[key]}`)
      .join('&');

    const secureHash = createHmac('sha512', VNP_HASHSECRET)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    params.vnp_SecureHash = secureHash;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${VNP_URL.replace('vpcpay.html', 'merchant_webapi/api/transaction')}`,
          params
        )
      );
      const data = response.data;

      console.log('VNPay Query Response:', data);

      const isValid = data.vnp_ResponseCode === '00';
      const status = isValid ? '00' : data.vnp_ResponseCode || 'unknown';
      const transactionIdResult = data.vnp_TransactionNo || transactionId;

      return {
        isValid,
        transactionId: transactionIdResult,
        status,
        message:
          data.vnp_Message ||
          (isValid ? 'Giao dịch thành công' : 'Giao dịch thất bại'),
      };
    } catch (error) {
      console.error('VNPay Query Error:', error);
      return {
        isValid: false,
        transactionId,
        status: 'unknown',
        message: 'Lỗi khi tra cứu giao dịch VNPay',
      };
    }
  }
}

// Handler cho Momo
class MomoQueryHandler implements PaymentQueryHandler {
  constructor(
    private config: typeof AppConfig.momo,
    private httpService: HttpService
  ) {}

  async queryTransaction(
    orderId: string,
    transactionId: string
  ): Promise<TransactionStatus> {
    const {
      MOMO_PARTNER_CODE,
      MOMO_ACCESS_KEY,
      MOMO_SECRET_KEY,
      MOMO_REQUEST_URL,
    } = this.config;
    const requestId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const requestTime = format(new Date(), 'yyyyMMddHHmmss', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });

    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&orderId=${orderId}&partnerCode=${MOMO_PARTNER_CODE}&requestId=${requestId}&requestTime=${requestTime}`;

    const signature = createHmac('sha256', MOMO_SECRET_KEY)
      .update(Buffer.from(rawSignature, 'utf-8'))
      .digest('hex');

    const params = {
      partnerCode: MOMO_PARTNER_CODE,
      accessKey: MOMO_ACCESS_KEY,
      requestId,
      orderId,
      requestTime,
      signature,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${MOMO_REQUEST_URL.replace('/create', '/query')}`,
          params
        )
      );
      const data = response.data;

      console.log('Momo Query Response:', data);

      const isValid = data.resultCode === 0;
      const status = isValid ? '00' : data.resultCode.toString();
      const transactionIdResult = data.transId || transactionId;

      return {
        isValid,
        transactionId: transactionIdResult,
        status,
        message:
          data.message ||
          (isValid ? 'Giao dịch thành công' : 'Giao dịch thất bại'),
      };
    } catch (error) {
      console.error('Momo Query Error:', error);
      return {
        isValid: false,
        transactionId,
        status: 'unknown',
        message: 'Lỗi khi tra cứu giao dịch Momo',
      };
    }
  }
}

// Handler cho ZaloPay
class ZaloPayQueryHandler implements PaymentQueryHandler {
  constructor(
    private config: typeof AppConfig.zalopay,
    private httpService: HttpService
  ) {}

  async queryTransaction(
    orderId: string,
    transactionId: string
  ): Promise<TransactionStatus> {
    const { ZALOPAY_APP_ID, ZALOPAY_KEY1, ZALOPAY_REQUEST_URL } = this.config;
    const appTransId = `${Date.now()}_${orderId}`;
    const appTime = Date.now();

    const rawSignature = `app_id=${ZALOPAY_APP_ID}&app_trans_id=${appTransId}&app_time=${appTime}`;

    const mac = createHmac('sha256', ZALOPAY_KEY1)
      .update(Buffer.from(rawSignature, 'utf-8'))
      .digest('hex');

    const params = {
      app_id: ZALOPAY_APP_ID,
      app_trans_id: appTransId,
      app_time: appTime.toString(),
      mac,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${ZALOPAY_REQUEST_URL.replace('/create', '/query')}`,
          params
        )
      );
      const data = response.data;

      console.log('ZaloPay Query Response:', data);

      const isValid = data.return_code === 1;
      const status = isValid ? '00' : data.return_code.toString();
      const transactionIdResult = data.zp_trans_id || transactionId;

      return {
        isValid,
        transactionId: transactionIdResult,
        status,
        message:
          data.return_message ||
          (isValid ? 'Giao dịch thành công' : 'Giao dịch thất bại'),
      };
    } catch (error) {
      console.error('ZaloPay Query Error:', error);
      return {
        isValid: false,
        transactionId,
        status: 'unknown',
        message: 'Lỗi khi tra cứu giao dịch ZaloPay',
      };
    }
  }
}

// Factory để chọn handler
class PaymentQueryHandlerFactory {
  static createHandler(
    paymentMethod: string,
    httpService: HttpService
  ): PaymentQueryHandler {
    switch (paymentMethod) {
      case 'vnpay':
        return new VNPayQueryHandler(AppConfig.vnpay, httpService);
      case 'momo':
        return new MomoQueryHandler(AppConfig.momo, httpService);
      case 'zalopay':
        return new ZaloPayQueryHandler(AppConfig.zalopay, httpService);
      default:
        throw new BadRequestException(
          'Phương thức thanh toán không được hỗ trợ'
        );
    }
  }
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    private httpService: HttpService
  ) {}

  async verifyPayment(orderId: string) {
    console.log(`Verifying payment for order ${orderId}`);

    // Tìm đơn hàng
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['payment'],
    });

    if (!order || !order.payment) {
      throw new NotFoundException(
        'Không tìm thấy đơn hàng hoặc thông tin thanh toán'
      );
    }

    // Kiểm tra phương thức thanh toán
    const paymentMethod = order.payment.method;
    if (paymentMethod === 'cod') {
      throw new BadRequestException(
        'Endpoint này chỉ hỗ trợ thanh toán online (VNPay, Momo, ZaloPay)'
      );
    }

    // Nếu trạng thái đã là success hoặc failed, trả về ngay
    if (['success', 'failed'].includes(order.payment.status)) {
      return {
        success: order.payment.status === 'success',
        message:
          order.payment.status === 'success'
            ? 'Thanh toán đã hoàn tất'
            : 'Thanh toán thất bại',
        status: order.payment.status,
        transactionId: order.payment.transaction_id || '',
      };
    }

    // Tạo handler để tra cứu giao dịch
    const handler = PaymentQueryHandlerFactory.createHandler(
      paymentMethod,
      this.httpService
    );

    // Tra cứu trạng thái giao dịch
    const { isValid, transactionId, status, message } =
      await handler.queryTransaction(
        orderId,
        order.payment.transaction_id || ''
      );

    // Cập nhật trạng thái thanh toán
    if (isValid && status === '00') {
      order.payment.status = 'success';
      order.payment.transaction_id = transactionId;
      await this.paymentRepo.save(order.payment);
      await this.orderRepo.save(order);

      return {
        success: true,
        message: 'Thanh toán thành công',
        status: 'success',
        transactionId,
      };
    } else {
      order.payment.status = 'failed';
      await this.paymentRepo.save(order.payment);
      await this.orderRepo.save(order);

      return {
        success: false,
        message: message || 'Thanh toán thất bại',
        status,
        transactionId,
      };
    }
  }
}
