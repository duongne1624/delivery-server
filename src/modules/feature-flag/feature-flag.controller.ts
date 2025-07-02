import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Feature Flags')
@Controller('feature-flags')
export class FeatureFlagController {
  constructor(private readonly service: FeatureFlagService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả feature flags' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách feature flags trả về thành công',
  })
  async getAll() {
    return this.service.findAll();
  }

  @Get(':key')
  @ApiOperation({ summary: 'Lấy thông tin feature flag theo key' })
  @ApiParam({ name: 'key', description: 'Key định danh feature flag' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin feature flag trả về thành công',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy feature flag' })
  async getOne(@Param('key') key: string) {
    const flag = await this.service.getByKey(key);
    if (!flag) throw new NotFoundException('Feature flag not found');
    return flag;
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới một feature flag' })
  @ApiBody({ type: CreateFeatureFlagDto })
  @ApiResponse({ status: 201, description: 'Tạo feature flag thành công' })
  async create(@Body() dto: CreateFeatureFlagDto) {
    return this.service.create(dto);
  }

  @Patch(':key')
  @ApiOperation({ summary: 'Cập nhật trạng thái của feature flag' })
  @ApiParam({
    name: 'key',
    description: 'Key định danh feature flag cần cập nhật',
  })
  @ApiBody({ type: UpdateFeatureFlagDto })
  @ApiResponse({ status: 200, description: 'Cập nhật trạng thái thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy feature flag' })
  async update(@Param('key') key: string, @Body() dto: UpdateFeatureFlagDto) {
    return this.service.updateStatus(key, dto.is_enabled);
  }
}
