import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message, MessageSchema } from './message.schema';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';
import { NotificationsService } from '@modules/notifications/notifications.service';
import {
  Notification,
  NotificationSchema,
} from '@modules/notifications/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
    ChatGateway,
    ChatService,
    NotificationsGateway,
    NotificationsService,
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
