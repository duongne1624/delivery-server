import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Shared
import { DatabaseModule } from '@shared/database/database.module';
import { RedisService } from '@shared/redis/redis.service';
import { FileUploadModule } from '@shared/file-upload/file-upload.module';
import { MongoModule } from '@shared/mongo/mongo.module';

// Common
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { FaviconMiddleware } from './common/middleware/favicon.middleware';

// Modules
import { RedisModule } from '@shared/redis/redis.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { RestaurantsModule } from '@modules/restaurants/restaurants.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { ProductsModule } from '@modules/products/products.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { AssignmentsModule } from '@modules/assignments/assignments.module';
import { PaymentsModule } from '@modules/payments/payments.module';
// import { NotificationsModule } from '@modules/notifications/notifications.module';
// import { FeedbackModule } from '@modules/feedback/feedback.module';
// import { LogsModule } from '@modules/logs/logs.module';

@Module({
  imports: [
    DatabaseModule,
    MongoModule,
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'siuuu',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
    FileUploadModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    AssignmentsModule,
    PaymentsModule,
    // NotificationsModule,
    // FeedbackModule,
    // LogsModule,
  ],
  providers: [
    RedisService,
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FaviconMiddleware).forRoutes('*');
  }
}
