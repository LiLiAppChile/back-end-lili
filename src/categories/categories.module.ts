import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './services/categories.service';
import { FirestoreModule } from '../firestore/firestore.module';
import { FirebaseAuthModule } from '../FirebaseAuthGuard/firebase-auth.module';

@Module({
  imports: [HttpModule, ConfigModule, FirestoreModule, FirebaseAuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
