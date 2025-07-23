import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AssignmentResponse {
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export class RespondAssignmentDto {
  @ApiProperty({ enum: AssignmentResponse })
  @IsEnum(AssignmentResponse)
  response: AssignmentResponse;
}
