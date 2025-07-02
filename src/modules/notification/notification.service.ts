import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.interface';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private readonly model: Model<Notification>
  ) {}

  async findByRecipient(recipient_id: string): Promise<Notification[]> {
    return this.model.find({ recipient_id }).sort({ created_at: -1 }).exec();
  }

  async create(dto: CreateNotificationDto): Promise<Notification> {
    return this.model.create({ ...dto, read: false, created_at: new Date() });
  }

  async markAsRead(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { read: true });
  }
}
