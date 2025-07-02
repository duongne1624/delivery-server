import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Audit Logs')
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách nhật ký thao tác' })
  @ApiQuery({
    name: 'actor_id',
    required: false,
    type: String,
    description: 'ID của người thực hiện (user, admin, shipper)',
  })
  @ApiResponse({ status: 200, description: 'Danh sách nhật ký thao tác' })
  async getLogs(@Query('actor_id') actor_id?: string): Promise<any[]> {
    if (actor_id && typeof actor_id === 'string') {
      return this.service.findByActor(actor_id);
    }
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo nhật ký thao tác mới' })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  async create(@Body() dto: CreateAuditLogDto): Promise<any> {
    return this.service.create(dto);
  }
}
