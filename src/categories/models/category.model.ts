import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ description: 'ID de la categoría', example: '123456' })
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónicos',
  })
  name: string;

  @ApiProperty({
    description: 'Permalink de la categoría',
    example: 'electronicos',
  })
  permalink: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría padre',
    example: '100',
  })
  parent_id?: string | null;

  @ApiPropertyOptional({
    description: 'Descripción de la categoría',
    example: 'Dispositivos electrónicos y accesorios',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de la categoría',
    example: 'https://example.com/images/electronicos.jpg',
  })
  image_url?: string;

  @ApiPropertyOptional({
    description: 'Productos asociados a la categoría',
    example: [
      { id: '123', name: 'Producto 1' },
      { id: '456', name: 'Producto 2' },
    ],
    type: 'array',
  })
  products?: any[];

  @ApiProperty({
    description: 'Marca de tiempo de creación',
    example: '2025-03-31T12:34:56.789Z',
  })
  createdAt: string;
}
