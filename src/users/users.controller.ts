import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '../users/models/users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './services/users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

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
      {
        createdAt: createUserDto.createdAt,
        delete: createUserDto.delete || false,
        validUser: createUserDto.validUser || false,
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
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':uid')
  async findOne(@Param('uid') uid: string): Promise<User> {
    return this.usersService.findOne(uid);
  }

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'uid', description: 'El UID del usuario a actualizar' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido actualizado exitosamente',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Put(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(uid, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'uid', description: 'El UID del usuario a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':uid')
  async delete(@Param('uid') uid: string): Promise<void> {
    return this.usersService.delete(uid);
  }
}