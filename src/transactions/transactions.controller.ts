import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Patch,
  } from '@nestjs/common';
  import { Transaction } from './models/transactions.model';
  import { TransactionService } from './services/transactions.service';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
  import { CreateTransactionDto } from './dto/create-transaction.dto';
  import { UpdateTransactionDto } from './dto/update-transaction.dto';
  
  @ApiTags('transactions')
  @Controller('transactions')
  export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}
  
    @ApiOperation({ summary: 'Crear una nueva transacción' })
    @ApiResponse({
      status: 201,
      description: 'La transacción ha sido creada exitosamente',
      type: Transaction,
    })
    @Post()
    async create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
      return this.transactionService.createTransaction(createTransactionDto);
    }
  
    @ApiOperation({ summary: 'Obtener una transacción por ID' })
    @ApiParam({ name: 'transactionId', description: 'El ID de la transacción' })
    @ApiResponse({
      status: 200,
      description: 'Retorna la transacción',
      type: Transaction,
    })
    @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
    @Get(':transactionId')
    async findOne(@Param('transactionId') transactionId: string): Promise<Transaction> {
      return this.transactionService.getTransactionById(transactionId);
    }
  
    @ApiOperation({ summary: 'Marcar una transacción como completada' })
    @ApiParam({ name: 'transactionId', description: 'El ID de la transacción' })
    @ApiResponse({
      status: 200,
      description: 'La transacción ha sido marcada como completada',
      type: Transaction,
    })
    @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
    @Patch(':transactionId/complete')
    async complete(@Param('transactionId') transactionId: string): Promise<Transaction> {
      return this.transactionService.markTransactionAsCompleted(transactionId);
    }
  
    @ApiOperation({ summary: 'Marcar una transacción como reembolsada' })
    @ApiParam({ name: 'transactionId', description: 'El ID de la transacción' })
    @ApiResponse({
      status: 200,
      description: 'La transacción ha sido marcada como reembolsada',
      type: Transaction,
    })
    @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
    @Patch(':transactionId/refund')
    async refund(@Param('transactionId') transactionId: string): Promise<Transaction> {
      return this.transactionService.markTransactionAsRefunded(transactionId);
    }
  
    @ApiOperation({ summary: 'Actualizar una transacción' })
    @ApiParam({ name: 'transactionId', description: 'El ID de la transacción' })
    @ApiResponse({
      status: 200,
      description: 'La transacción ha sido actualizada exitosamente',
      type: Transaction,
    })
    @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
    @Patch(':transactionId')
    async update(
      @Param('transactionId') transactionId: string,
      @Body() updateTransactionDto: UpdateTransactionDto,
    ): Promise<Transaction> {
      return this.transactionService.updateTransaction(transactionId, updateTransactionDto);
    }
  
    @ApiOperation({ summary: 'Obtener todas las transacciones' })
    @ApiResponse({
      status: 200,
      description: 'Retorna todas las transacciones',
      type: [Transaction],
    })
    @Get()
    async findAll(): Promise<Transaction[]> {
      return this.transactionService.getAllTransactions();
    }
  }