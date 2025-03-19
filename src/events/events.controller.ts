import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { EventsService } from './services/events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const userId = 'admin'; // Aquí deberías obtenerlo del token de autenticación
    return this.eventsService.createEvent(createEventDto, userId);
  }

  @Get()
  async findAll() {
    return this.eventsService.getEvents();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.eventsService.cancelEvent(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }
}
