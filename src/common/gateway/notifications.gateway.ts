import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    console.log('Socket Gateway Initialized');
  }

  sendToShipper(shipperId: string, data: any) {
    this.server.to(`shipper_${shipperId}`).emit('new-order', data);
  }

  notifyAllShippers(data: any) {
    this.server.emit('broadcast-order', data);
  }
}
