import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WalletTransaction } from './wallet.interface';
import { Model } from 'mongoose';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('WalletTransaction')
    private readonly model: Model<WalletTransaction>
  ) {}

  async findByUser(user_id: string): Promise<WalletTransaction[]> {
    return this.model.find({ user_id }).sort({ created_at: -1 }).exec();
  }

  async create(data: Partial<WalletTransaction>): Promise<WalletTransaction> {
    return this.model.create(data);
  }

  async getBalance(user_id: string): Promise<number> {
    const transactions = await this.model
      .find({ user_id, status: 'completed' })
      .exec();
    return transactions.reduce((sum, tx) => {
      if (tx.type === 'topup' || tx.type === 'refund') return sum + tx.amount;
      else if (tx.type === 'payment') return sum - tx.amount;
      return sum;
    }, 0);
  }
}
