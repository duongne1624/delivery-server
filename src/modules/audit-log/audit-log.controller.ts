import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  @Get()
  async getLogs(@Query('actor_id') actor_id?: string) {
    if (actor_id) return this.service.findByActor(actor_id);
    return this.service.findAll();
  }

  @Post()
  async create(@Body() dto: CreateAuditLogDto) {
    return this.service.create(dto);
  }
}
