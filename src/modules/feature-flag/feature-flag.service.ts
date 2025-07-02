import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FeatureFlag } from './feature-flag.interface';
import { Model } from 'mongoose';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';

@Injectable()
export class FeatureFlagService {
  constructor(
    @InjectModel('FeatureFlag') private readonly model: Model<FeatureFlag>
  ) {}

  async findAll(): Promise<FeatureFlag[]> {
    return this.model.find().exec();
  }

  async create(dto: CreateFeatureFlagDto): Promise<FeatureFlag> {
    return this.model.create({
      ...dto,
      updated_at: new Date(),
    });
  }

  async updateStatus(key: string, is_enabled: boolean) {
    return this.model.findOneAndUpdate(
      { key },
      { is_enabled, updated_at: new Date() },
      { new: true }
    );
  }

  async getByKey(key: string): Promise<FeatureFlag | null> {
    return this.model.findOne({ key }).exec();
  }
}
