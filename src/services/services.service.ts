import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../config/firebase.config';
import { Service } from '../interfaces/service.interface';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  private readonly servicesCollection = db.collection('services');

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const serviceData = {
      ...createServiceDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const serviceRef = await this.servicesCollection.add(serviceData);

    return {
      id: serviceRef.id,
      ...serviceData,
    };
  }

  async findAll(): Promise<Service[]> {
    const snapshot = await this.servicesCollection.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Service[];
  }

  async findOne(id: string): Promise<Service> {
    const serviceDoc = await this.servicesCollection.doc(id).get();
    if (!serviceDoc.exists) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return {
      id: serviceDoc.id,
      ...serviceDoc.data(),
    } as Service;
  }

  async update(
    id: string,
    updateServiceDto: Partial<CreateServiceDto>,
  ): Promise<Service> {
    const serviceDoc = await this.servicesCollection.doc(id).get();
    if (!serviceDoc.exists) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    const updateData = {
      ...updateServiceDto,
      updatedAt: new Date(),
    };

    if (updateData.createdAt) {
      updateData.createdAt = new Date(updateData.createdAt);
    }

    await this.servicesCollection.doc(id).update(updateData);

    const updatedServiceDoc = await this.servicesCollection.doc(id).get();
    return {
      id: updatedServiceDoc.id,
      ...updatedServiceDoc.data(),
    } as Service;
  }

  async delete(id: string): Promise<void> {
    const serviceDoc = await this.servicesCollection.doc(id).get();
    if (!serviceDoc.exists) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    await this.servicesCollection.doc(id).delete();
  }
}
