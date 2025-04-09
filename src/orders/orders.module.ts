import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { JumpsellerService } from './services/jumpseller.service';
import { OrdersService } from './services/orders.service';
import { FirestoreModule } from '../firestore/firestore.module';
import { FirebaseAuthModule } from '../FirebaseAuthGuard/firebase-auth.module';

@Module({
  imports: [HttpModule, ConfigModule, FirestoreModule, FirebaseAuthModule],
  controllers: [OrdersController],
  providers: [JumpsellerService, OrdersService],
  exports: [JumpsellerService, OrdersService],
})
export class OrdersModule {}
