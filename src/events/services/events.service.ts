import { Injectable } from '@nestjs/common';
import { db } from '../../config/firebase.config';
import { Event } from '../models/event.model';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

@Injectable()
export class EventsService {
  private readonly eventsCollection = db.collection('events');

  async createEvent(
    createEventDto: CreateEventDto,
    userId: string,
  ): Promise<Event> {
    const event: Omit<Event, 'id'> = {
      ...createEventDto,
      createdBy: userId,
      createdAt: new Date(),
      status: 'active',
    };

    // Limpiar el objeto para eliminar `undefined`
    const cleanEvent = JSON.parse(JSON.stringify(event));

    // Restaurar fechas como objetos `Date`
    cleanEvent.start = new Date(cleanEvent.start);
    cleanEvent.end = new Date(cleanEvent.end);
    cleanEvent.createdAt = new Date(cleanEvent.createdAt);

    const docRef = await this.eventsCollection.add(cleanEvent);
    return { id: docRef.id, ...cleanEvent };
  }

  async getEvents(): Promise<Event[]> {
    const snapshot = await this.eventsCollection.get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        status: data.status as 'active' | 'canceled',
      } as Event;
    });
  }

  async getEventById(id: string): Promise<Event | null> {
    const doc = await this.eventsCollection.doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      status: data?.status as 'active' | 'canceled',
    } as Event;
  }

  async updateEvent(id: string, updateEventDto: UpdateEventDto) {
    const doc = await this.eventsCollection.doc(id).get();
    if (!doc.exists) return null;

    // ✅ Filtrar propiedades undefined antes de actualizar Firestore
    const updateData = Object.fromEntries(
      Object.entries(updateEventDto).filter(([_, v]) => v !== undefined),
    );

    await this.eventsCollection.doc(id).update(updateData);
    return { id, ...updateData };
  }

  async cancelEvent(id: string) {
    const doc = await this.eventsCollection.doc(id).get();
    if (!doc.exists) return null;
    await this.eventsCollection.doc(id).update({ status: 'canceled' });
    return { message: 'Event canceled successfully' };
  }

  async deleteEvent(id: string) {
    const doc = await this.eventsCollection.doc(id).get();
    if (!doc.exists) return { message: 'Event not found' };
    await this.eventsCollection.doc(id).delete();
    return { message: 'Event deleted successfully' };
  }
}
