import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { FirebaseAuthModule } from '../FirebaseAuthGuard/firebase-auth.module';

@Module({
  imports: [FirebaseAuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
