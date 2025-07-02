import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogSchema } from './audit-log.schema';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AuditLog', schema: AuditLogSchema }]),
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [MongooseModule],
})
export class AuditLogModule {}
