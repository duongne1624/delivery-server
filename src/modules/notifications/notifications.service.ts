import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>
  ) {}

  async createNotification(
    userId: string,
    notification: {
      title: string;
      body: string;
      status: number;
      time: Date;
      read: boolean;
      orderId: string;
    }
  ) {
    const newNotification = new this.notificationModel({
      userId,
      ...notification,
    });
    return newNotification.save();
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).sort({ time: -1 }).exec();
  }
}
