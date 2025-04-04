import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { UploadController } from './cloudinary/upload.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ReviewsModule } from './reviews/reviews.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    TransactionsModule,
    ReviewsModule,
    ServicesModule,
    WebhooksModule,
    OrdersModule,
    CategoriesModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}