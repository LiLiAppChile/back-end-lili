import {
  isBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({ description: 'ID', example: '123abc' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Nombre', example: 'Alberto Gallardo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email',
    example: 'john@example.com',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Clave',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Numero de telefono',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    description: 'Timestamp',
    example: '2023-06-21T14:56:32Z',
  })
  @IsOptional()
  @IsString()
  createdAt?: string;

  @isBoolean()
  @ApiProperty({
    description: 'Usuario eliminado',
    default: false,
  })
  delete: boolean = false;

  @isBoolean()
  @ApiProperty({
    description: 'Usuario validado',
    default: false,
  })
  validUser: boolean = false;
}
