import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  is_read: boolean;

  @Prop({ default: 'info' }) // info | warning | promo
  type: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
