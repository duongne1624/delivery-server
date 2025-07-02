import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletTransaction } from './wallet.interface';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.request';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Get('transactions')
  @ApiOperation({ summary: 'Lấy danh sách giao dịch của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách giao dịch của người dùng',
    type: [CreateWalletTransactionDto],
  })
  async getUserTransactions(
    @Req() req: AuthRequest
  ): Promise<WalletTransaction[]> {
    return this.service.findByUser(req.user.user_id);
  }

  @Post('transactions')
  @ApiOperation({
    summary: 'Tạo giao dịch mới (nạp tiền, thanh toán, hoàn tiền)',
  })
  @ApiResponse({
    status: 201,
    description: 'Giao dịch đã được tạo',
    type: CreateWalletTransactionDto,
  })
  async createTransaction(
    @Body() dto: CreateWalletTransactionDto,
    @Req() req: AuthRequest
  ): Promise<WalletTransaction> {
    return this.service.create({
      ...dto,
      user_id: req.user.user_id,
    });
  }

  @Get('balance')
  @ApiOperation({ summary: 'Lấy số dư ví hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Số dư ví',
    schema: {
      example: { balance: 150000 },
    },
  })
  async getBalance(@Req() req: AuthRequest): Promise<{ balance: number }> {
    const balance = await this.service.getBalance(req.user.user_id);
    return { balance };
  }
}
