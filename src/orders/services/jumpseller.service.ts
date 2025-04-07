import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { db } from '../../config/firebase.config';

export interface SavedOrder {
  id: string;
  orderId: string;
  status: string;
}

@Injectable()
export class JumpsellerService {
  private readonly logger = new Logger(JumpsellerService.name);
  private readonly ordersCollection = db.collection('pedidos');
  private readonly baseUrl = 'https://api.jumpseller.com/v1';
  private readonly login: string;
  private readonly authToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Usar cadena vacía por defecto para evitar valores undefined
    this.login = this.configService.get<string>('JUMPSELLER_LOGIN') || '';
    this.authToken =
      this.configService.get<string>('JUMPSELLER_AUTH_TOKEN') || '';
  }

  async fetchPaidOrders() {
    try {
      const url = `${this.baseUrl}/orders/status/paid.json?login=${this.login}&authtoken=${this.authToken}`;

      this.logger.log('Obteniendo pedidos pagados desde la API de Jumpseller');
      const response = await firstValueFrom(this.httpService.get(url));

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(
          'Formato de respuesta inválido de la API de Jumpseller',
        );
      }

      const orders = response.data;
      this.logger.log(`Se recuperaron ${orders.length} pedidos pagados`);

      // Almacenar cada pedido en Firestore
      const savedOrders = await this.saveOrdersToFirestore(orders);

      return {
        message: `Se obtuvieron y almacenaron exitosamente ${savedOrders.length} pedidos`,
        savedOrders,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener pedidos: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async fetchOrdersByStatus(
    status: string,
  ): Promise<{ message: string; savedOrders: SavedOrder[] }> {
    try {
      const url = `${this.baseUrl}/orders/status/${status}.json?login=${this.login}&authtoken=${this.authToken}`;

      this.logger.log(
        `Obteniendo pedidos con estado ${status} desde la API de Jumpseller`,
      );
      const response = await firstValueFrom(this.httpService.get(url));

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(
          `Formato de respuesta inválido de la API de Jumpseller para el estado ${status}`,
        );
      }

      const orders = response.data;
      this.logger.log(
        `Se recuperaron ${orders.length} pedidos con estado ${status}`,
      );

      // Almacenar cada pedido en Firestore
      const savedOrders = await this.saveOrdersToFirestore(orders);

      return {
        message: `Se obtuvieron y almacenaron exitosamente ${savedOrders.length} pedidos con estado ${status}`,
        savedOrders,
      };
    } catch (error) {
      this.logger.error(
        `Error al obtener pedidos con estado ${status}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async saveOrdersToFirestore(orders: any[]) {
    const savedOrders: SavedOrder[] = [];

    for (const order of orders) {
      try {
        // Verificar si el pedido está anidado en una propiedad "order"
        const actualOrder = order.order || order;

        // Validar que el pedido tenga un ID
        if (!actualOrder.id) {
          this.logger.warn(
            `El pedido no tiene un ID válido: ${JSON.stringify(actualOrder)}`,
          );
          continue;
        }

        // Determinar la colección según el estado del pedido
        const collectionName =
          actualOrder.status === 'cancelled' ? 'cancelados' : 'pedidos';
        const targetCollection = db.collection(collectionName);

        // Verificar si el pedido ya existe en la colección correspondiente
        const existingOrdersQuery = await targetCollection
          .where('orderId', '==', actualOrder.id.toString())
          .get();

        if (!existingOrdersQuery.empty) {
          this.logger.log(
            `El pedido ${actualOrder.id} ya existe en la colección ${collectionName}, omitiendo`,
          );
          continue;
        }


        const specialtiesOptions = [
          "Gasfitería",
          "Electricidad",
          "Cerrajería",
          "Limpieza",
          "Seguridad",
          "Climatización",
          "Carpintería",
          "Albañilería",
          "Pintura",
          "Jardinería",
          "Artefactos",
          "Control de plagas",
        ];
        
        const serviceId = Number(actualOrder.products[0]?.id) || null;
        console.log('ID del servicio:', serviceId);
        
        const categories = await db.collection('categories').get();
        
        let categoryName = null;
        
        if (serviceId) {
          const categoryRef = categories.docs.find((doc) => {
            const data = doc.data();
            const hasMatchingProduct = data.products?.some((product) => product.id === serviceId);
            const isInSpecialties = specialtiesOptions.includes(data.name);
            return hasMatchingProduct && isInSpecialties;
          });
        
          if (categoryRef) {
            categoryName = categoryRef.data().name;
            console.log('Nombre de la categoría encontrada (con cruce):', categoryName);
          } else {
            console.log('No se encontró una categoría que cruce nombre y serviceId');
          }
        }
        
        
        
        // Preparar datos del pedido para almacenamiento
        const orderData = {
          orderId: actualOrder.id.toString(),
          status: actualOrder.status,
          montoTotal: actualOrder.total,
          emailCliente: actualOrder.customer?.email || '',
          nombreCliente: actualOrder.customer?.fullname || '',
          telefono: actualOrder.customer?.phone || '',
          productos: actualOrder.products || [],
          metodoPago: actualOrder.payment_method_name || '',
          fechaCreacion: new Date(actualOrder.created_at).toISOString(),
          fechaImportacion: new Date().toISOString(),
          datosOriginales: actualOrder,
          categoria: categoryName || null,
        };

        // Almacenar en la colección correspondiente
        const docRef = await targetCollection.add(orderData);
        savedOrders.push({
          id: docRef.id,
          orderId: orderData.orderId,
          status: orderData.status,
        });

        this.logger.log(
          `Pedido ${orderData.orderId} guardado en la colección ${collectionName}`,
        );
      } catch (orderError) {
        this.logger.error(
          `Error al guardar el pedido ${order?.id || 'desconocido'}: ${orderError.message}`,
          orderError.stack,
        );
      }
    }

    return savedOrders;
  }
}
