import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
  IsObject,
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

  @ApiPropertyOptional({ description: 'RUT del profesional', example: '12.345.678-9' })
  @IsOptional()
  @IsString()
  rut?: string;

  @ApiPropertyOptional({ description: 'Comuna donde reside el profesional', example: 'Santiago' })
  @IsOptional()
  @IsString()
  commune?: string;

  @ApiPropertyOptional({ description: 'Registrado en el SII', example: true })
  @IsOptional()
  @IsBoolean()
  siiRegistered?: boolean;

  @ApiPropertyOptional({ description: 'Tiene herramientas propias', example: true })
  @IsOptional()
  @IsBoolean()
  hasTools?: boolean;

  @ApiPropertyOptional({ description: 'Tiene vehículo propio', example: true })
  @IsOptional()
  @IsBoolean()
  ownTransportation?: boolean;

  @ApiPropertyOptional({
    description: 'Lista de especialidades',
    example: ['electricidad', 'gasfitería'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  specialties?: string[];

  @ApiPropertyOptional({ description: 'Descripción de la experiencia laboral', example: 'Más de 10 años de experiencia.' })
  @IsOptional()
  @IsString()
  professionalExperience?: string;

  @ApiPropertyOptional({ description: 'Texto personal sobre el profesional', example: 'Profesional dedicado y responsable.' })
  @IsOptional()
  @IsString()
  personalDescription?: string;

  @ApiPropertyOptional({
    description: 'Comunas donde ofrece servicios',
    example: ['Santiago', 'Providencia'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  workAreas?: string[];

  @ApiPropertyOptional({
    description: 'Horario disponible',
    example: { lunes: '09:00-18:00', viernes: '10:00-14:00' },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  availability?: { [key: string]: string };

  @ApiPropertyOptional({ description: 'URL de la foto de perfil', example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'Certificado de Antecedentes para Fines Especiales',
    example: { url: 'https://example.com/background.pdf' },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  backgroundCertificate?: { url: string };

  @ApiPropertyOptional({
    description: 'Cédula de Identidad (URLs de archivos)',
    example: { frontUrl: 'https://example.com/ci_front.jpg', backUrl: 'https://example.com/ci_back.jpg' },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  identityCard?: { frontUrl: string; backUrl: string };

  @ApiPropertyOptional({
    description: 'Certificado Adicional (SEC, Chile Valora, Título Univ o Técnico)',
    example: { url: 'https://example.com/certificate.pdf' },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  additionalCertificate?: { url: string };

  @ApiPropertyOptional({ description: 'Cómo conoció la plataforma', example: 'Recomendación de un amigo' })
  @IsOptional()
  @IsString()
  contactSource?: string;

  @ApiPropertyOptional({ description: 'Usuario eliminado', example: false })
  @IsOptional()
  @IsBoolean()
  delete?: boolean;

  @ApiPropertyOptional({ description: 'Usuario validado', example: true })
  @IsOptional()
  @IsBoolean()
  validUser?: boolean;

  @ApiPropertyOptional({ description: 'Estado del usuario', example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}