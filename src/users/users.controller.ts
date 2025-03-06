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
    type: CreateUserDto,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = new User(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      createUserDto.phone,
      {
        id: createUserDto.id,
        createdAt: createUserDto.createdAt,
      }
    );

    user.markAsDeleted();
    user.validateUser();

    return this.usersService.create(user);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Retorna todos los usuarios',
    type: [CreateUserDto],
  })
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'El ID del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Retorna el usuario',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'El ID del usuario a actualizar' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido actualizado exitosamente',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'El ID del usuario a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'El usuario ha sido eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}