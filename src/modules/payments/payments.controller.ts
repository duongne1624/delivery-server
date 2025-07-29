import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { createHmac } from 'crypto';
import { AppConfig } from '@config/app.config';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('callback/zalopay')
  @ApiOperation({
    summary: 'Xử lý callback từ ZaloPay để cập nhật trạng thái thanh toán',
  })
  @ApiBody({
    description: 'Dữ liệu callback từ ZaloPay',
    examples: {
      example1: {
        value: {
          data: '{"app_trans_id": "1753686660634_12345_9335", "status": 1}',
          mac: 'your_hmac_signature',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Callback được xử lý thành công',
    schema: {
      example: {
        return_code: 1,
        return_message: 'Callback processed successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Callback không hợp lệ',
  })
  async handleZaloPayCallback(@Body() body: any) {
    const { data, mac } = body;

    if (!data || !mac) {
      throw new BadRequestException('Missing data or mac in callback');
    }

    // Xác minh chữ ký
    const { ZALOPAY_KEY2 } = AppConfig.zalopay;
    const expectedMac = createHmac('sha256', ZALOPAY_KEY2)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .update(data)
      .digest('hex');

    if (expectedMac !== mac) {
      throw new BadRequestException('Invalid callback signature');
    }

    // Parse dữ liệu callback
    let callbackData: { app_trans_id: string; status: number };
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      callbackData = JSON.parse(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Invalid callback data format');
    }

    const { app_trans_id } = callbackData;

    // Cập nhật trạng thái thanh toán
    try {
      await this.paymentsService.updatePaymentStatus(app_trans_id, 1);
      return {
        return_code: 1,
        return_message: 'Callback processed successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to process callback: ${error.message}`
      );
    }
  }
}
