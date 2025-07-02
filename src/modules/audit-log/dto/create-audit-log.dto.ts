import { IsString, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ActorType {
  USER = 'user',
  ADMIN = 'admin',
  SHIPPER = 'shipper',
  SYSTEM = 'system',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
}

class TargetDto {
  @ApiProperty({ example: 'orders' })
  @IsString()
  collection: string;

  @ApiProperty({ example: '64efed90e2...' })
  @IsString()
  document_id: string;
}

export class CreateAuditLogDto {
  @ApiProperty({ example: '64efed90e2...' })
  @IsString()
  actor_id: string;

  @ApiProperty({ enum: ActorType })
  @IsEnum(ActorType)
  actor_type: ActorType;

  @ApiProperty({ enum: AuditAction })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty()
  @ValidateNested()
  @Type(() => TargetDto)
  target: TargetDto;

  @ApiPropertyOptional({ example: { name: 'old name' } })
  @IsOptional()
  old_data?: any;

  @ApiPropertyOptional({ example: { name: 'new name' } })
  @IsOptional()
  new_data?: any;

  @ApiPropertyOptional({ example: '192.168.1.1' })
  @IsOptional()
  @IsString()
  ip_address?: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0 (Windows NT 10.0; Win64)' })
  @IsOptional()
  @IsString()
  device_info?: string;
}
