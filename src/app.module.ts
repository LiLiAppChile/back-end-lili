// filepath: /Users/Macbook/Documents/Programming/Lili/back-end-lili/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TransactionsModule,
    ReviewsModule,
    ServicesModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
