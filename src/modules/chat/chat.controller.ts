import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Get(':order_id')
  @ApiOperation({ summary: 'Lấy danh sách tin nhắn theo đơn hàng' })
  @ApiParam({
    name: 'order_id',
    description: 'ID của đơn hàng',
    example: '64a7c5df8e5bfa001e4e1a77',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tin nhắn được trả về thành công',
  })
  async getChat(@Param('order_id') order_id: string) {
    return this.service.getMessagesByOrder(order_id);
  }

  @Post()
  @ApiOperation({ summary: 'Gửi tin nhắn mới' })
  @ApiResponse({ status: 201, description: 'Tin nhắn được tạo thành công' })
  async create(@Body() dto: CreateChatDto) {
    return this.service.create(dto);
  }
}
