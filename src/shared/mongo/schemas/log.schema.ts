import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Log extends Document {
  @Prop({ required: true })
  level: string; // info | warning | error

  @Prop({ required: true })
  message: string;

  @Prop()
  user_id?: string;

  @Prop()
  context?: string; // optional module/function name

  @Prop()
  metadata?: Record<string, any>;
}

export const LogSchema = SchemaFactory.createForClass(Log);
