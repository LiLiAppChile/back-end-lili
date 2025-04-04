import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { EventsController } from './events.controller';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
