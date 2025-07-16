import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('vnpay/verify')
  @ApiOperation({ summary: 'Xác minh thanh toán từ VNPAY (sau redirect)' })
  @ApiQuery({ name: 'vnp_Amount', required: true, type: String })
  @ApiQuery({ name: 'vnp_BankCode', required: true, type: String })
  @ApiQuery({ name: 'vnp_OrderInfo', required: true, type: String })
  @ApiQuery({
    name: 'vnp_ResponseCode',
    required: true,
    type: String,
    example: '00',
  })
  @ApiQuery({
    name: 'vnp_TxnRef',
    required: true,
    type: String,
    description: 'Mã đơn hàng (orderId)',
  })
  @ApiQuery({ name: 'vnp_TransactionNo', required: false, type: String })
  @ApiQuery({ name: 'vnp_SecureHash', required: true, type: String })
  @ApiQuery({ name: 'vnp_SecureHashType', required: false, type: String })
  async verifyVnpayPayment(@Query() query: any) {
    return this.paymentsService.verifyVnpayPayment(query);
  }
}
