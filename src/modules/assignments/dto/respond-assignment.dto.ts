import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RespondAssignmentDto {
  @ApiProperty({ enum: ['accepted', 'rejected'] })
  @IsEnum(['accepted', 'rejected'])
  response: 'accepted' | 'rejected';
}
