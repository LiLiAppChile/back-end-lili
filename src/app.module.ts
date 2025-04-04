import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { UploadController } from './cloudinary/upload.controller';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, TransactionsModule],
  controllers: [AppController, UploadController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}