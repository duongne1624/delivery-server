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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportIssueController {
  constructor(private readonly service: ReportIssueService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo báo cáo mới' })
  @ApiResponse({ status: 201, description: 'Báo cáo đã được tạo thành công' })
  @ApiBody({ type: CreateReportDto })
  async create(@Body() dto: CreateReportDto, @Req() req: AuthRequest) {
    return this.service.create(dto, req.user.user_id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả các báo cáo' })
  @ApiResponse({ status: 200, description: 'Danh sách báo cáo' })
  async getAll() {
    return this.service.findAll();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái báo cáo' })
  @ApiParam({ name: 'id', description: 'ID của báo cáo' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['reviewing', 'resolved'],
        },
      },
      required: ['status'],
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'reviewing' | 'resolved'
  ) {
    return this.service.updateStatus(id, status);
  }
}
