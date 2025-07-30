import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true })
  status: number;
  // 1: Đơn hàng mới
  // 2: Đang xử lý (giao hàng)
  // 3: Hoàn thành
  // 4: Khuyến mãi
  // 5: Chat

  @Prop({ required: true })
  time: Date;

  @Prop({ default: false })
  read: boolean;

  @Prop({ required: true })
  orderId: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
