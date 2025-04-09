import { Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from '../../firestore/firestore.service';
import { Order } from '../models/orders.model';

@Injectable()
export class OrdersService {
  constructor(private readonly firestoreService: FirestoreService) {}

  async findAll(): Promise<Order[]> {
    const orders = await this.firestoreService.findAll('pedidos');
    return orders as Order[];
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.firestoreService.findOne('pedidos', id);
    if (!order) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return order as Order;
  }

  async update(id: string, updateOrderData: Partial<Order>): Promise<Order> {
    await this.findOne(id);
    await this.firestoreService.update('pedidos', id, updateOrderData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.firestoreService.delete('pedidos', id);
  }
}
