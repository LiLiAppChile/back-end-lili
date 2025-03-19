import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { EventsModule } from './events/events.module';

@Module({

  imports: [ConfigModule.forRoot(), UsersModule, TransactionsModule, ReviewsModule, ServicesModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}