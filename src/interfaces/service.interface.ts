export interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  isActive: boolean;
  certifications: string;
  portfolio: string;
  createdAt?: Date;
  updatedAt?: Date;
}
