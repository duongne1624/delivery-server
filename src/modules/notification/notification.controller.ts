import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../../common/interfaces/auth-request.interface';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  async getMyNotifications(@Req() req: AuthRequest) {
    return this.service.findByRecipient(req.user.user_id);
  }

  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }
}
