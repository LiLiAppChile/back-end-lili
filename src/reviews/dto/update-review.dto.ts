import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @ApiPropertyOptional({
    example: 'Llegó un poco tarde, pero hizo un buen trabajo.',
    description: 'Comentario actualizado del cliente',
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Nueva puntuación del servicio (1 a 5 estrellas)',
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}
