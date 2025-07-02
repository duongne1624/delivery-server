import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chat.interface';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat') private readonly model: Model<ChatMessage>
  ) {}

  async getMessagesByOrder(order_id: string): Promise<ChatMessage[]> {
    return this.model.find({ order_id }).sort({ created_at: 1 }).exec();
  }

  async create(dto: CreateChatDto): Promise<ChatMessage> {
    return this.model.create({ ...dto, read: false, created_at: new Date() });
  }

  async markAllAsRead(order_id: string, user_id: string): Promise<void> {
    await this.model.updateMany(
      { order_id, sender_id: { $ne: user_id }, read: false },
      { $set: { read: true } }
    );
  }
}
