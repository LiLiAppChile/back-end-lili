import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseEnumPipe,
} from '@nestjs/common'; // Agregado ParseEnumPipe
import { JumpsellerService, SavedOrder } from './services/jumpseller.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../FirebaseAuthGuard/firebase-auth.guard';

interface RespuestaPedidos {
  message: string;
  savedOrders: SavedOrder[];
}

@ApiTags('pedidos')
@Controller('pedidos')
export class OrdersController {
  constructor(private readonly jumpsellerService: JumpsellerService) {}

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
}
