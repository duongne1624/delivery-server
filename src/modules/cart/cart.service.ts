import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.interface';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  async getByUser(user_id: string): Promise<Cart | null> {
    return this.cartModel.findOne({ user_id }).exec();
  }

  async updateOrCreate(user_id: string, items: any[]): Promise<Cart> {
    return this.cartModel
      .findOneAndUpdate(
        { user_id },
        { items, updated_at: new Date() },
        { upsert: true, new: true }
      )
      .exec();
  }

  async clearCart(user_id: string): Promise<void> {
    await this.cartModel.findOneAndDelete({ user_id }).exec();
  }
}
