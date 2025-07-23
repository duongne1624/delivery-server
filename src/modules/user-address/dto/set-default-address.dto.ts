import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetDefaultAddressDto {
  @ApiProperty({ description: 'User address ID to set as default' })
  @IsUUID()
  address_id: string;
}
