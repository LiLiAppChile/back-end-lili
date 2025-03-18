export class Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
  createdBy: string;
  createdAt: Date;
  status: 'active' | 'canceled';
  image?: string; // URL opcional de la imagen
}
