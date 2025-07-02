import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeatureFlagSchema } from './feature-flag.schema';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagController } from './feature-flag.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FeatureFlag', schema: FeatureFlagSchema },
    ]),
  ],
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService],
  exports: [MongooseModule],
})
export class FeatureFlagModule {}
