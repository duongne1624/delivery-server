import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  orderId: string; // ID của đơn hàng liên quan

  @Prop({ required: true })
  senderId: string; // ID của người gửi (khách hàng hoặc shipper)

  @Prop({ required: true })
  receiverId: string; // ID của người nhận

  @Prop({ required: true })
  content: string; // Nội dung tin nhắn

  @Prop({ default: Date.now })
  timestamp: Date; // Thời gian gửi tin nhắn

  @Prop({ default: false })
  read: boolean; // Trạng thái đã đọc
}

export const MessageSchema = SchemaFactory.createForClass(Message);
