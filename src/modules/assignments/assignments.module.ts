import { OrdersModule } from '@modules/orders/orders.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { CommonModule } from '@common/common.module';

@Module({
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
  imports: [OrdersModule, UsersModule, CommonModule],
})
export class AssignmentsModule {}
