import { Injectable, Logger } from '@nestjs/common';
import { JumpsellerWebhookDto } from './dto/jumpseller-webhook.dto';
import { db } from '../config/firebase.config';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly ordersCollection = db.collection('orders');

  async processJumpsellerWebhook(jumpsellerWebhookDto: JumpsellerWebhookDto) {
    if (!jumpsellerWebhookDto.orderId || !jumpsellerWebhookDto.status) {
      this.logger.error('Datos incompletos en el webhook');
      throw new Error('Datos incompletos en el webhook');
    }

    const orderData = {
      orderId: jumpsellerWebhookDto.orderId,
      status: jumpsellerWebhookDto.status,
      totalAmount: jumpsellerWebhookDto.totalAmount,
      additionalData: jumpsellerWebhookDto.additionalData,
      receivedAt: new Date().toISOString(),
    };

    this.logger.log(`Procesando orden: ${JSON.stringify(orderData)}`);

    await this.ordersCollection.add(orderData);
    return { message: 'La data de la orden se guardo correctamente' };
  }
}
