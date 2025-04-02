import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsObject } from 'class-validator';

export class JumpsellerWebhookDto {
  @ApiProperty({ description: 'ID de la orden', example: '12345' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'Estado de la orden', example: 'paid' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Monto total de la orden', example: 100.5 })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({ description: 'Datos adicionales de la orden', example: {} })
  @IsObject()
  @IsNotEmpty()
  additionalData: object;
}
