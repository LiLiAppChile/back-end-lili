import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '../users/models/users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './services/users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../FirebaseAuthGuard/firebase-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Obtener estado de la API' })
  @ApiResponse({ status: 200, description: 'Retorna el estado de la API' })
  @Get('estado')
  getStatus(): string {
    return 'Está funcionando';
  }

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'El usuario ha sido creado exitosamente',
    type: User,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = new User(
      createUserDto.uid,
      createUserDto.name,
      createUserDto.email,
      createUserDto.phone,
      createUserDto.rut,
      createUserDto.specialties,
      {
        createdAt: createUserDto.createdAt,
        delete: createUserDto.delete || false,
        validUser: createUserDto.validUser || false,
        commune: createUserDto.commune,
        siiRegistered: createUserDto.siiRegistered,
        hasTools: createUserDto.hasTools,
        ownTransportation: createUserDto.ownTransportation,
        professionalExperience: createUserDto.professionalExperience,
        personalDescription: createUserDto.personalDescription,
        workAreas: createUserDto.workAreas,
        availability: createUserDto.availability,
        profilePicture: createUserDto.profilePicture,
        backgroundCertificate: createUserDto.backgroundCertificate,
        identityCardFront: createUserDto.identityCardFront,
        identityCardBack: createUserDto.identityCardBack,
        additionalCertificate: createUserDto.additionalCertificate,
        contactSource: createUserDto.contactSource,
        status: createUserDto.status,
      }
    );

    if (createUserDto.delete) {
      user.markAsDeleted();
    }
    if (createUserDto.validUser) {
      user.validateUser();
    }

    return this.usersService.create(user);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos los usuarios',
    type: [User],
  })
  @Get()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un usuario por UID' })
  @ApiParam({ name: 'uid', description: 'El UID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Retorna el usuario',
    type: User,
  })
  @ApiResponse({ status: 403, description: 'No autorizado para acceder a esta información' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':uid')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('uid') uid: string, @Req() request): Promise<User> {
    const userUid = request.user?.uid;

    if (userUid !== uid) {
      throw new ForbiddenException('No tienes permiso para acceder a esta información');
    }

    return this.usersService.findOne(uid);
  }

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'uid', description: 'El UID del usuario a actualizar' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido actualizado exitosamente',
    type: User,
  })
  @ApiResponse({ status: 403, description: 'No autorizado para actualizar esta información' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Put(':uid')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request,
  ): Promise<User> {
    const userUid = request.user?.uid;

    if (userUid !== uid) {
      throw new ForbiddenException('No tienes permiso para actualizar este usuario');
    }

    return this.usersService.update(uid, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'uid', description: 'El UID del usuario a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido eliminado exitosamente',
  })
  @ApiResponse({ status: 403, description: 'No autorizado para eliminar este usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':uid')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  async delete(@Param('uid') uid: string, @Req() request): Promise<void> {
    const userUid = request.user?.uid;

    if (userUid !== uid) {
      throw new ForbiddenException('No tienes permiso para eliminar este usuario');
    }

    return this.usersService.delete(uid);
  }
}