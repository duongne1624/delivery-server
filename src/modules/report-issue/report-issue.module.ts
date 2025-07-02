import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportIssueSchema } from './report-issue.schema';
import { ReportIssueController } from './report-issue.controller';
import { ReportIssueService } from './report-issue.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ReportIssue', schema: ReportIssueSchema },
    ]),
  ],
  controllers: [ReportIssueController],
  providers: [ReportIssueService],
  exports: [MongooseModule],
})
export class ReportIssueModule {}
