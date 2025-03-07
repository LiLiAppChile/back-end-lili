import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString, Min, Max } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'El ID de la solicitud de servicio asociada a la transacción',
    example: 'req_123456',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    description: 'Monto que recibe el profesional',
    example: 20000,
  })
  @IsNumber()
  @IsNotEmpty()
  professionalAmount: number;

  @ApiProperty({
    description: 'Método de pago utilizado',
    example: 'credit_card',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    description: 'Comisión de la plataforma (porcentaje, ej: 10 para 10%)',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  platformFee: number;

  @ApiProperty({
    description: 'Fecha de pago (opcional)',
    example: '2023-10-27',
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}