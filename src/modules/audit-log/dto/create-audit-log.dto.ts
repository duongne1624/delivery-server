import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export class CreateAuditLogDto {
  @IsString()
  actor_id: string;

  @IsEnum(['user', 'admin', 'shipper', 'system'])
  actor_type: 'user' | 'admin' | 'shipper' | 'system';

  @IsEnum(['create', 'update', 'delete', 'login'])
  action: 'create' | 'update' | 'delete' | 'login';

  @IsObject()
  target: {
    collection: string;
    document_id: string;
  };

  @IsOptional()
  old_data?: any;

  @IsOptional()
  new_data?: any;

  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  @IsString()
  device_info?: string;
}
