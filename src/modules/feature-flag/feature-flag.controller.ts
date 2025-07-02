import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';

@Controller('feature-flags')
export class FeatureFlagController {
  constructor(private readonly service: FeatureFlagService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @Get(':key')
  async getOne(@Param('key') key: string) {
    return this.service.getByKey(key);
  }

  @Post()
  async create(@Body() dto: CreateFeatureFlagDto) {
    return this.service.create(dto);
  }

  @Patch(':key')
  async update(@Param('key') key: string, @Body() dto: UpdateFeatureFlagDto) {
    return this.service.updateStatus(key, dto.is_enabled);
  }
}
