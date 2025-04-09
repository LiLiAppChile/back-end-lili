import { ApiProperty } from '@nestjs/swagger';

export class JumpsellerOrderDto {
  @ApiProperty({ description: 'Order ID from Jumpseller' })
  id: number;

  @ApiProperty({ description: 'Order status' })
  status: string;

  @ApiProperty({ description: 'Order total amount' })
  total: number;

  @ApiProperty({ description: 'Customer information' })
  customer: {
    email: string;
    name: string;
    phone: string;
  };

  @ApiProperty({ description: 'Products ordered' })
  products: any[];

  @ApiProperty({ description: 'Payment method details' })
  payment_method: {
    name: string;
  };

  @ApiProperty({ description: 'Order creation date' })
  created_on: string;
}
