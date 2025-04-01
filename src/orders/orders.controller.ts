import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseEnumPipe,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { JumpsellerService, SavedOrder } from './services/jumpseller.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../FirebaseAuthGuard/firebase-auth.guard';
import { OrdersService } from './services/orders.service';
import { Order } from './models/orders.model';

interface RespuestaPedidos {
  message: string;
  savedOrders: SavedOrder[];
}

@ApiTags('pedidos')
@Controller('pedidos')
export class OrdersController {
  constructor(
    private readonly jumpsellerService: JumpsellerService,
    private readonly ordersService: OrdersService,
  ) {}

  @ApiOperation({ summary: 'Obtener pedidos pagados de Jumpseller' })
  @ApiResponse({
    status: 200,
    description: 'Pedidos obtenidos y almacenados exitosamente',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @Get('obtener-pagados')
  async fetchPaidOrders(): Promise<RespuestaPedidos> {
    return this.jumpsellerService.fetchPaidOrders();
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('obtener-por-estado/:estado')
  async obtenerPedidosPorEstado(
    @Param('estado', new ParseEnumPipe(['paid', 'pending', 'cancelled']))
    estado: string,
  ) {
    return this.jumpsellerService.fetchOrdersByStatus(estado);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: Partial<Order>,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
