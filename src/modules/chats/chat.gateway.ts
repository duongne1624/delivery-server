import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket, orderId: string) {
    await client.join(orderId);
    console.log(`Client ${client.id} joined chat room: ${orderId}`);
    // Đánh dấu tin nhắn chưa đọc là đã đọc khi user tham gia phòng chat
    const userId = client.handshake.query.userId as string;
    await this.chatService.markAsRead(orderId, userId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: {
      orderId: string;
      senderId: string;
      receiverId: string;
      content: string;
    }
  ) {
    const { orderId, senderId, receiverId, content } = payload;
    // Lưu tin nhắn vào database
    const message = await this.chatService.sendMessage(
      orderId,
      senderId,
      receiverId,
      content
    );
    // Gửi tin nhắn đến phòng chat của orderId
    this.server.to(orderId).emit('message', message);
  }
}
