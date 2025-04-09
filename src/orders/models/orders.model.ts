export class Order {
  id?: string;
  orderId: string;
  status: string;
  montoTotal: number;
  emailCliente: string;
  nombreCliente: string;
  telefono: string;
  productos: any[];
  metodoPago: string;
  fechaCreacion: string;
  fechaImportacion: string;
}
