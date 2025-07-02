import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './audit-log.interface';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel('AuditLog') private readonly model: Model<AuditLog>
  ) {}

  async create(dto: CreateAuditLogDto): Promise<AuditLog> {
    return this.model.create({
      ...dto,
      created_at: new Date(),
    });
  }

  async findByActor(actor_id: string): Promise<AuditLog[]> {
    return this.model.find({ actor_id }).exec();
  }

  async findAll(): Promise<AuditLog[]> {
    return this.model.find().sort({ created_at: -1 }).limit(100).exec();
  }
}
