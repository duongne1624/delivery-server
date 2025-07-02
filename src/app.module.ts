/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Config } from './config';

import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { AddonModule } from './modules/addon/addon.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { ReviewModule } from './modules/review/review.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { AuthModule } from './modules/auth/auth.module';
import { FeatureFlagModule } from './modules/feature-flag/feature-flag.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReportIssueModule } from './modules/report-issue/report-issue.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReviewTagModule } from './modules/review-tag/review-tag.module';

@Module({
  imports: [
    MongooseModule.forRoot(Config.mongoUri),
    CategoryModule,
    ProductModule,
    RestaurantModule,
    AddonModule,
    UserModule,
    OrderModule,
    CartModule,
    VoucherModule,
    ReviewModule,
    WalletModule,
    AuthModule,
    FeatureFlagModule,
    AuditLogModule,
    ChatModule,
    ReportIssueModule,
    NotificationModule,
    ReviewTagModule
  ],
})
export class AppModule {}
