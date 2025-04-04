import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nombre del servicio',
    example: 'Reparación de electricidad',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción del servicio',
    example: 'Reparación de instalaciones eléctricas en el hogar',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Precio del servicio', example: 50 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Duración del servicio en minutos', example: 60 })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'Categoría del servicio',
    example: 'Electricidad',
  })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Estado del servicio', example: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Certificaciones del profesional',
    example: 'ChileValora, SEC',
  })
  @IsString()
  certifications: string;

  @ApiProperty({
    description: 'Portafolio del profesional',
    example: 'Enlace a portafolio o descripción de trabajos anteriores',
  })
  @IsString()
  portfolio: string;

  @ApiPropertyOptional({
    description: 'Fecha de creación',
    example: '2023-06-21T14:56:32Z',
  })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de actualización',
    example: '2023-06-21T14:56:32Z',
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
