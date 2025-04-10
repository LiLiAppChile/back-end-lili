import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max, Length, Matches, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 'abc123',
    description: 'ID de la solicitud (request) asociada a la reseña',
    required: true,
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[a-zA-Z0-9\-_]+$/, {
    message: 'El requestId solo puede contener letras, números, guiones y guiones bajos',
  })
  readonly requestId: string;

  @ApiProperty({
    example: 'user789',
    description: 'ID del cliente que dejó la reseña',
    required: true,
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'El clientId solo puede contener letras y números',
  })
  readonly clientId: string;

  @ApiProperty({
    example: 'user456',
    description: 'ID del profesional que realizó el servicio',
    required: true,
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'El professionalId solo puede contener letras y números',
  })
  readonly professionalId: string;

  @ApiProperty({
    example: 5,
    description: 'Puntuación del servicio (1 a 5 estrellas)',
    required: true,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly rating: number;

  @ApiProperty({
    example: 'Muy buen servicio, puntual y profesional.',
    description: 'Comentario del cliente sobre el servicio',
    required: true,
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(500)
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:¡!¿?()\-_]+$/, {
    message: 'El comentario contiene caracteres no permitidos',
  })
  readonly comment: string;
}
