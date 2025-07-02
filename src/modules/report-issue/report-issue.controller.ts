import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReportIssueService } from './report-issue.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.request';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportIssueController {
  constructor(private readonly service: ReportIssueService) {}

  @Post()
  async create(@Body() dto: CreateReportDto, @Req() req: AuthRequest) {
    return this.service.create(dto, req.user.user_id);
  }

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'reviewing' | 'resolved'
  ) {
    return this.service.updateStatus(id, status);
  }
}
