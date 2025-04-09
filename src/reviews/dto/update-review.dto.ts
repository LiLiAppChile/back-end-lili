import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  Length,
  Matches,
  IsNotEmpty
} from 'class-validator';

export class UpdateReviewDto {
  @ApiPropertyOptional({
    example: 'Llegó un poco tarde, pero hizo un buen trabajo.',
    description: 'Comentario actualizado del cliente',
    minLength: 10,
    maxLength: 500,
    required: false
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
  @Length(10, 500, {
    message: 'El comentario debe tener entre 10 y 500 caracteres'
  })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:¡!¿?()\-_]+$/, {
    message: 'El comentario contiene caracteres no permitidos'
  })
  comment?: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Nueva puntuación del servicio (1 a 5 estrellas)',
    minimum: 1,
    maximum: 5,
    required: false
  })
  @IsNumber({}, { message: 'La puntuación debe ser un número' })
  @Min(1, { message: 'La puntuación mínima es 1' })
  @Max(5, { message: 'La puntuación máxima es 5' })
  @IsOptional()
  rating?: number;
}