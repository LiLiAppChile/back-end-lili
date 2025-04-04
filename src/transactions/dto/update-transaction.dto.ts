import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class UpdateTransactionDto {
  @ApiPropertyOptional({
    description: 'Nuevo estado de la transacción',
    example: 'completado',
    enum: ['pendiente', 'completado', 'reembolsado'],
  })
  @IsOptional()
  @IsString()
  paymentStatus?: 'pendiente' | 'completado' | 'reembolsado';

  @ApiPropertyOptional({
    description: 'Nuevo método de pago',
    example: 'bank_transfer',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Nuevo monto que recibe el profesional',
    example: 22000,
  })
  @IsOptional()
  @IsNumber()
  professionalAmount?: number;

  @ApiPropertyOptional({
    description:
      'Nuevo porcentaje de comisión de la plataforma (ej: 12 para 12%)',
    example: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  platformFee?: number;
}
