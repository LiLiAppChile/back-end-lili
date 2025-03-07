import {
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    MinLength,
    MaxLength,
    Matches,
  } from 'class-validator';
  import { ApiPropertyOptional } from '@nestjs/swagger';
  
  export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'Nombre', example: 'Nuevo Nombre' })
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres.' })
    name?: string;
  
    @ApiPropertyOptional({ description: 'Email', example: 'nuevo@email.com' })
    @IsOptional()
    @IsEmail()
    @IsString()
    email?: string;
  
    @ApiPropertyOptional({ description: 'Número de teléfono', example: '+56987654321' })
    @IsOptional()
    @IsString()
    @Matches(/^\+?\d{10,15}$/, {
      message: 'El número de teléfono debe ser válido y tener entre 10 y 15 dígitos.',
    })
    phone?: string;
  
    @ApiPropertyOptional({ description: 'Usuario eliminado', example: false })
    @IsOptional()
    @IsBoolean()
    delete?: boolean;
  
    @ApiPropertyOptional({ description: 'Usuario validado', example: true })
    @IsOptional()
    @IsBoolean()
    validUser?: boolean;
  }