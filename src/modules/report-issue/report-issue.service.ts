import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportIssue } from './report-issue.interface';
import { Model } from 'mongoose';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportIssueService {
  constructor(
    @InjectModel('ReportIssue') private readonly model: Model<ReportIssue>
  ) {}

  async create(
    dto: CreateReportDto,
    reporter_id: string
  ): Promise<ReportIssue> {
    return this.model.create({
      ...dto,
      reporter_id,
      created_at: new Date(),
    });
  }

  async findAll(): Promise<ReportIssue[]> {
    return this.model.find().sort({ created_at: -1 }).exec();
  }

  async updateStatus(id: string, status: 'reviewing' | 'resolved') {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }
}
