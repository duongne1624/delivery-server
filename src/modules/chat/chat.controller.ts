import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Get(':order_id')
  async getChat(@Param('order_id') order_id: string) {
    return this.service.getMessagesByOrder(order_id);
  }

  @Post()
  async create(@Body() dto: CreateChatDto) {
    return this.service.create(dto);
  }
}
