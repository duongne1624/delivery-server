import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletTransaction } from './wallet.interface';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.request';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Get('transactions')
  async getUserTransactions(
    @Req() req: AuthRequest
  ): Promise<WalletTransaction[]> {
    return this.service.findByUser(req.user.user_id);
  }

  @Post('transactions')
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
  async getBalance(@Req() req: AuthRequest): Promise<{ balance: number }> {
    const balance = await this.service.getBalance(req.user.user_id);
    return { balance };
  }
}
