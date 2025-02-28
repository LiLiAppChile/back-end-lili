import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseConfigService } from './config/mongoose.config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Carga las variables de entorno
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UsersModule,
  ],
})
export class AppModule {}
