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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo của người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách thông báo trả về thành công',
  })
  async getMyNotifications(@Req() req: AuthRequest) {
    return this.service.findByRecipient(req.user.user_id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo một thông báo mới' })
  @ApiResponse({
    status: 201,
    description: 'Thông báo được tạo thành công',
  })
  async create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Đánh dấu thông báo là đã đọc' })
  @ApiParam({ name: 'id', required: true, description: 'ID của thông báo' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái đã đọc thành công',
  })
  async markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }
}
