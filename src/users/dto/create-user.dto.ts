import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'UID proporcionado por Firebase Authentication', example: 'abc123xyz' })
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ description: 'Nombre', example: 'Alberto Gallardo' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres.' })
  name: string;

  @ApiProperty({ description: 'Email', example: 'john@example.com' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Número de teléfono', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'El número de teléfono debe ser válido y tener entre 10 y 15 dígitos.',
  })
  phone: string;

  @ApiPropertyOptional({ description: 'Timestamp', example: '2023-06-21T14:56:32Z' })
  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Usuario eliminado',
    default: false,
  })
  delete: boolean = false;

  @IsBoolean()
  @ApiProperty({
    description: 'Usuario validado',
    default: false,
  })
  validUser: boolean = false;
}