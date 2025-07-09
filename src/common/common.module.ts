import { Module } from '@nestjs/common';
import { NotificationsGateway } from './gateway/notifications.gateway';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class CommonModule {}
