import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Feedback extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  order_id?: string;

  @Prop({ default: 0 })
  rating: number; // scale 1–5

  @Prop({ default: 'pending' }) // pending | resolved | rejected
  status: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
