import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { JumpsellerService } from './services/jumpseller.service';
import { FirebaseAuthModule } from '../FirebaseAuthGuard/firebase-auth.module';

@Module({
  imports: [HttpModule, ConfigModule, FirebaseAuthModule],
  controllers: [OrdersController],
  providers: [JumpsellerService],
  exports: [JumpsellerService],
})
export class OrdersModule {}
