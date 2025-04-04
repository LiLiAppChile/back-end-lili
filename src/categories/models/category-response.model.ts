import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from './category.model';

export class CategoryResponse {
  @ApiProperty({
    description: 'Estado de éxito de la operación',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Marca de tiempo de la respuesta',
    example: '2025-03-31T12:34:56.789Z',
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Mensaje de la respuesta',
    example: 'Categorías obtenidas con éxito',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Datos de la respuesta',
    type: Object,
    additionalProperties: true,
  })
  data?: any;
}

export class CategoriesListResponse extends CategoryResponse {
  @ApiProperty({ description: 'Número total de categorías', example: 42 })
  count: number;

  @ApiProperty({
    description: 'Arreglo de categorías',
    type: [Category],
    isArray: true,
  })
  declare data: Category[];
}

export class CategoryDetailResponse extends CategoryResponse {
  @ApiProperty({
    description: 'Detalles de la categoría',
    type: Category,
    nullable: true,
  })
  declare data: Category | null;
}
