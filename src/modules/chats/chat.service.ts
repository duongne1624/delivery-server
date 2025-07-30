import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';

interface ReturnMessage {
  id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly notificationGateway: NotificationsGateway
  ) {}

  async sendMessage(
    orderId: string,
    senderId: string,
    receiverId: string,
    content: string
  ) {
    const newMessage = new this.messageModel({
      orderId,
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
      read: false,
    });
    const savedNewMessage = newMessage.save();
    await this.sendMessageNotification(receiverId, content, orderId);
    return savedNewMessage;
  }

  async getMessages(orderId: string): Promise<ReturnMessage[]> {
    try {
      const messageChats = await this.messageModel
        .find({ orderId })
        .sort({ timestamp: 1 })
        .exec();

      return messageChats.map((message) => ({
        id: message.id.toString(),
        orderId: message.orderId,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        timestamp: message.timestamp.toString(),
        read: message.read,
      }));
    } catch (error) {
      console.error(`Error fetching messages for order ${orderId}:`, error);
      throw new Error('Failed to fetch messages');
    }
  }

  async markAsRead(orderId: string, userId: string) {
    return this.messageModel
      .updateMany({ orderId, receiverId: userId, read: false }, { read: true })
      .exec();
  }

  // Gửi thông báo khi gửi tin nhắn
  private async sendMessageNotification(
    userId: string,
    message: string,
    orderId: string
  ) {
    // Gửi socket tới user qua NotificationGateway
    await this.notificationGateway.sendNotification(userId, {
      title: 'Tin nhắn mới',
      body: message,
      status: 5,
      time: new Date(),
      read: false,
      orderId: orderId,
    });
  }
}
