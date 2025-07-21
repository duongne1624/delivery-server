import { Controller, Get, BadRequestException, Param } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('verify/:id')
  @ApiOperation({
    summary: 'Kiểm tra trạng thái thanh toán online của đơn hàng',
  })
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
    description: 'Mã đơn hàng cần kiểm tra',
  })
  async verifyPayment(@Param('id') orderId: string) {
    if (!orderId) {
      throw new BadRequestException('Thiếu orderId');
    }
    return this.paymentsService.verifyPayment(orderId);
  }
}
