import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 'abc123',
    description: 'ID de la solicitud (request) asociada a la reseña',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    example: 'user789',
    description: 'ID del cliente que dejó la reseña',
  })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    example: 'user456',
    description: 'ID del profesional que realizó el servicio',
  })
  @IsString()
  @IsNotEmpty()
  professionalId: string;

  @ApiProperty({
    example: 5,
    description: 'Puntuación del servicio (1 a 5 estrellas)',
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Muy buen servicio, puntual y profesional.',
    description: 'Comentario del cliente sobre el servicio',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
