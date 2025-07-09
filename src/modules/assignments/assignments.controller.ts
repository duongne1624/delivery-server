import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Role } from '@common/constants/role.enum';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { AuthRequest } from '@common/interfaces/auth-request.interface';
import { AssignmentsService } from './assignments.service';
import { RedisService } from '@shared/redis/redis.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RespondAssignmentDto } from './dto/respond-assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(
    private readonly redisService: RedisService,
    private readonly assignmentService: AssignmentsService
  ) {}

  @Post(':orderId/respond')
  @Roles(Role.Shipper)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Response from shipper' })
  async respondToAssignment(
    @Param('orderId') orderId: string,
    @Body() body: RespondAssignmentDto,
    @Req() req: AuthRequest
  ) {
    const shipper = req.user;

    const key = `order_response_${orderId}_${req.user.userId}`;
    await this.redisService.set(key, body.response, 30);
    if (body.response === 'accepted') {
      await this.redisService.set(`order_assigned_${orderId}`, req.user.userId);

      await this.assignmentService.confirmAssignment(orderId, shipper.userId);
    }
    return { message: 'Response received' };
  }

  @Post(':orderId/auto-assign')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a shipper to assign' })
  async autoAssign(@Param('orderId') orderId: string, @Req() req: AuthRequest) {
    console.log('req.user:', req.user);

    if (req.user.role !== Role.Admin) {
      throw new ForbiddenException('Bạn không có quyền thực hiện');
    }

    await this.assignmentService.assignToNearestShipper(orderId);
    return { message: 'Assigning in progress' };
  }
}
