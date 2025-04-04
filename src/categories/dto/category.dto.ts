import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({ description: 'ID de la categoría de Jumpseller' })
  id: number;

  @ApiProperty({ description: 'Nombre de la categoría' })
  name: string;

  @ApiProperty({ description: 'Permalink de la categoría' })
  permalink: string;

  @ApiPropertyOptional({ description: 'ID de la categoría padre' })
  parent_id?: number | null;

  @ApiPropertyOptional({ description: 'Descripción de la categoría' })
  description?: string;

  @ApiPropertyOptional({ description: 'URL de la imagen de la categoría' })
  image_url?: string;
}
