import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async sendNotification(
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
    // Lưu thông báo vào database
    await this.notificationsService.createNotification(userId, notification);
    // Gửi thông báo đến client cụ thể
    this.server.to(userId).emit('notification', { userId, ...notification });
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, userId: string) {
    await client.join(userId);
    console.log(`Client ${client.id} joined room: ${userId}`);
  }
}
