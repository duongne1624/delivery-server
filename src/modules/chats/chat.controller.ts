import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':orderId')
  async getMessages(@Param('orderId') orderId: string): Promise<any> {
    return this.chatService.getMessages(orderId);
  }

  @Post('send')
  async sendMessage(
    @Body()
    body: {
      orderId: string;
      senderId: string;
      receiverId: string;
      content: string;
    }
  ) {
    return this.chatService.sendMessage(
      body.orderId,
      body.senderId,
      body.receiverId,
      body.content
    );
  }
}
