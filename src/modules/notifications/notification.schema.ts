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

  @Prop({ required: true })
  time: Date;

  @Prop({ default: false })
  read: boolean;

  @Prop({ required: true })
  orderId: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
