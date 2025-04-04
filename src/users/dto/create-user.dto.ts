import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'UID proporcionado por Firebase Authentication', example: 'abc123xyz' })
  @IsString({ message: 'El UID debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El UID es obligatorio.' })
  uid: string;

  @ApiProperty({ description: 'Nombre', example: 'Alberto Gallardo' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres.' })
  name: string;

  @ApiProperty({ description: 'Email', example: 'john@example.com' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @IsString({ message: 'El correo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  email: string;

  @ApiPropertyOptional({ description: 'Número de teléfono', example: '+1234567890' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @IsOptional()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'El número de teléfono debe ser válido y tener entre 10 y 15 dígitos.',
  })
  phone?: string | null = null;

  @ApiPropertyOptional({ description: 'RUT del profesional', example: '12.345.678-9' })
  @IsString({ message: 'El RUT debe ser una cadena de texto.' })
  @IsOptional()
  rut?: string | null = null;

  @ApiPropertyOptional({ description: 'Comuna donde reside el profesional', example: 'Santiago' })
  @IsString({ message: 'La comuna debe ser una cadena de texto.' })
  @IsOptional()
  commune?: string | null = null;

  @ApiPropertyOptional({ description: 'Registrado en el SII', example: true })
  @IsBoolean({ message: 'El campo siiRegistered debe ser booleano.' })
  @IsOptional()
  siiRegistered?: boolean = false;

  @ApiPropertyOptional({ description: 'Tiene herramientas propias', example: true })
  @IsBoolean({ message: 'El campo hasTools debe ser booleano.' })
  @IsOptional()
  hasTools?: boolean = false;

  @ApiPropertyOptional({ description: 'Tiene vehículo propio', example: true })
  @IsBoolean({ message: 'El campo ownTransportation debe ser booleano.' })
  @IsOptional()
  ownTransportation?: boolean = false;

  @ApiPropertyOptional({
    description: 'Lista de especialidades',
    example: ['electricidad', 'gasfitería'],
    type: [String],
  })
  @IsArray({ message: 'Las especialidades deben ser un array de cadenas de texto.' })
  @IsOptional()
  specialties?: string[] = [];

  @ApiPropertyOptional({ description: 'Descripción de la experiencia laboral', example: 'Más de 10 años de experiencia.' })
  @IsString({ message: 'La experiencia profesional debe ser una cadena de texto.' })
  @IsOptional()
  professionalExperience?: string | null = null;

  @ApiPropertyOptional({ description: 'Texto personal sobre el profesional', example: 'Profesional dedicado y responsable.' })
  @IsString({ message: 'La descripción personal debe ser una cadena de texto.' })
  @IsOptional()
  personalDescription?: string | null = null;

  @ApiPropertyOptional({
    description: 'Comunas donde ofrece servicios',
    example: ['Santiago', 'Providencia'],
    type: [String],
  })
  @IsArray({ message: 'Las áreas de trabajo deben ser un array de cadenas de texto.' })
  @IsOptional()
  workAreas?: string[] | null = null;

  @ApiPropertyOptional({
    description: 'Horario disponible',
    example: { lunes: '09:00-18:00', viernes: '10:00-14:00' },
    type: Object,
  })
  @IsObject({ message: 'La disponibilidad debe ser un objeto.' })
  @IsOptional()
  availability?: { [key: string]: string } | null = null;

  @ApiPropertyOptional({ description: 'URL de la foto de perfil', example: 'https://example.com/profile.jpg' })
  @IsString({ message: 'La URL de la foto de perfil debe ser una cadena de texto.' })
  @IsOptional()
  profilePicture?: string | null = null;

  @ApiPropertyOptional({
    description: 'Certificado de Antecedentes para Fines Especiales',
    example: { url: 'https://example.com/background.pdf' },
    type: Object,
  })
  @IsObject({ message: 'El certificado de antecedentes debe ser un objeto.' })
  @IsOptional()
  backgroundCertificate?: { url: string } | null = null;

  @ApiPropertyOptional({
    description: 'Cédula de Identidad (URLs de archivos)',
    example: { frontUrl: 'https://example.com/ci_front.jpg', backUrl: 'https://example.com/ci_back.jpg' },
    type: Object,
  })
  @IsObject({ message: 'El documento de identidad debe ser un objeto.' })
  @IsOptional()
  identityCardFront?: { url: string } | null = null;

  @ApiPropertyOptional({
    description: 'Cédula de Identidad (URLs de archivos)',
    example: { frontUrl: 'https://example.com/ci_front.jpg', backUrl: 'https://example.com/ci_back.jpg' },
    type: Object,
  })
  @IsObject({ message: 'El documento de identidad debe ser un objeto.' })
  @IsOptional()
  identityCardBack?: { url: string } | null = null;

  @ApiPropertyOptional({ description: 'Certificado Adicional (SEC, Chile Valora, Título Univ o Técnico)' })
  @IsObject({ message: 'El certificado adicional debe ser un objeto.' })
  @IsOptional()
  additionalCertificate?: { url: string } | null = null;

  @ApiPropertyOptional({ description: 'Cómo conoció la plataforma', example: 'Recomendación de un amigo' })
  @IsString({ message: 'La fuente de contacto debe ser una cadena de texto.' })
  @IsOptional()
  contactSource?: string | null = null;

  @ApiProperty({ description: 'Timestamp', example: '2023-06-21T14:56:32Z' })
  @IsString({ message: 'El timestamp debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El timestamp es obligatorio.' })
  createdAt: string;

  @ApiProperty({ description: 'Usuario eliminado', default: false })
  @IsBoolean({ message: 'El campo delete debe ser booleano.' })
  @IsOptional()
  delete?: boolean = false;

  @ApiProperty({ description: 'Usuario validado', default: false })
  @IsBoolean({ message: 'El campo validUser debe ser booleano.' })
  @IsNotEmpty({ message: 'El campo validUser es obligatorio.' })
  validUser: boolean;

  @ApiProperty({ description: 'Estado del usuario', default: 'pending' })
  @IsString({ message: 'El estado del usuario debe ser una cadena de texto.' })
  @IsOptional()
  status?: string = 'pending';

  @ApiPropertyOptional({ description: 'Nombre del banco', example: 'Banco de Chile' })
  @IsString({ message: 'El nombre del banco debe ser una cadena de texto.' })
  @IsOptional()
  bankName?: string | null = null;

  @ApiPropertyOptional({ description: 'Tipo de cuenta', example: 'Corriente' })
  @IsString({ message: 'El tipo de cuenta debe ser una cadena de texto.' })
  @IsOptional()
  accountType?: string | null = null;

  @ApiPropertyOptional({ description: 'Nombre del titular de la cuenta', example: 'Alberto Gallardo' })
  @IsString({ message: 'El nombre del titular debe ser una cadena de texto.' })
  @IsOptional()
  accountHolderName?: string | null = null;

  @ApiPropertyOptional({ description: 'Número de cuenta', example: '1234567890' })
  @IsString({ message: 'El número de cuenta debe ser una cadena de texto.' })
  @IsOptional()
  accountNumber?: number | null = null;
}