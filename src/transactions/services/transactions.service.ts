import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { db } from '../../config/firebase.config';
import { Transaction } from '../models/transactions.model';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  private readonly transactionsCollection = db.collection('transactions');

  private toTransaction(doc: FirebaseFirestore.DocumentSnapshot): Transaction {
    const data = doc.data() as {
      requestId: string;
      amount: number;
      paymentDate: string;
      paymentStatus: 'pendiente' | 'completado' | 'reembolsado';
      paymentMethod: string;
      platformFee: number;
      professionalAmount: number;
    };

    if (!data) {
      throw new Error('Los datos de la transacción no existen');
    }

    return new Transaction(
      doc.id,
      data.requestId,
      data.amount,
      data.paymentDate,
      data.paymentStatus,
      data.paymentMethod,
      data.platformFee,
      data.professionalAmount,
    );
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const existingTransaction = await this.transactionsCollection
      .where('requestId', '==', createTransactionDto.requestId)
      .get();

    if (!existingTransaction.empty) {
      throw new ConflictException(
        `Ya existe una transacción con el requestId: ${createTransactionDto.requestId}`,
      );
    }

    try {
      const platformFeeAmount =
        (createTransactionDto.platformFee / 100) *
        createTransactionDto.professionalAmount;
      const totalAmount =
        createTransactionDto.professionalAmount + platformFeeAmount;

      const transactionData = {
        requestId: createTransactionDto.requestId,
        amount: totalAmount,
        paymentDate:
          createTransactionDto.paymentDate || new Date().toISOString(),
        paymentStatus: 'pendiente',
        paymentMethod: createTransactionDto.paymentMethod,
        platformFee: createTransactionDto.platformFee,
        professionalAmount: createTransactionDto.professionalAmount,
      };
      const transactionRef =
        await this.transactionsCollection.add(transactionData);
      const transactionDoc = await transactionRef.get();
      return this.toTransaction(transactionDoc);
    } catch (error) {
      console.error('Error en la creación de la transacción:', error);

      // Manejo seguro del mensaje de error
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';

      throw new ConflictException(
        errorMessage || 'Error al crear la transacción',
      );
    }
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transactionDoc = await this.transactionsCollection
      .doc(transactionId)
      .get();
    if (!transactionDoc.exists) {
      throw new NotFoundException(
        `Transacción con ID ${transactionId} no encontrada`,
      );
    }
    return this.toTransaction(transactionDoc);
  }

  async markTransactionAsCompleted(
    transactionId: string,
  ): Promise<Transaction> {
    const transactionDoc = await this.transactionsCollection
      .doc(transactionId)
      .get();
    if (!transactionDoc.exists) {
      throw new NotFoundException(
        `Transacción con ID ${transactionId} no encontrada`,
      );
    }

    const data = transactionDoc.data() as {
      paymentStatus: 'pendiente' | 'completado' | 'reembolsado';
    };

    if (!data) {
      throw new NotFoundException(
        `Datos de la transacción con ID ${transactionId} no encontrados`,
      );
    }

    const currentStatus = data.paymentStatus;
    if (currentStatus === 'completado') {
      throw new ConflictException('La transacción ya está completada.');
    }
    if (currentStatus === 'reembolsado') {
      throw new ConflictException(
        'La transacción ya ha sido reembolsada y no se puede completar.',
      );
    }

    await this.transactionsCollection
      .doc(transactionId)
      .update({ paymentStatus: 'completado' });
    const updatedTransactionDoc = await this.transactionsCollection
      .doc(transactionId)
      .get();

    return this.toTransaction(updatedTransactionDoc);
  }

  async markTransactionAsRefunded(transactionId: string): Promise<Transaction> {
    const transactionDoc = await this.transactionsCollection
      .doc(transactionId)
      .get();
    if (!transactionDoc.exists) {
      throw new NotFoundException(
        `Transacción con ID ${transactionId} no encontrada`,
      );
    }

    const data = transactionDoc.data() as {
      paymentStatus: 'pendiente' | 'completado' | 'reembolsado';
    };

    if (!data) {
      throw new NotFoundException(
        `Datos de la transacción con ID ${transactionId} no encontrados`,
      );
    }

    const currentStatus = data.paymentStatus;
    if (currentStatus === 'reembolsado') {
      throw new ConflictException('La transacción ya ha sido reembolsada.');
    }
    if (currentStatus === 'pendiente') {
      throw new ConflictException(
        'La transacción debe estar completada para ser reembolsada.',
      );
    }

    await this.transactionsCollection
      .doc(transactionId)
      .update({ paymentStatus: 'reembolsado' });
    const updatedTransactionDoc = await this.transactionsCollection
      .doc(transactionId)
      .get();

    return this.toTransaction(updatedTransactionDoc);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const snapshot = await this.transactionsCollection.get();
    return snapshot.docs.map((doc) => this.toTransaction(doc));
  }

  async updateTransaction(
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transactionDoc = await this.transactionsCollection
      .doc(transactionId)
      .get();

    if (!transactionDoc.exists) {
      throw new NotFoundException(
        `Transacción con ID ${transactionId} no encontrada`,
      );
    }

    const updateData = {
      paymentStatus: updateTransactionDto.paymentStatus,
      paymentMethod: updateTransactionDto.paymentMethod,
      professionalAmount: updateTransactionDto.professionalAmount,
      platformFee: updateTransactionDto.platformFee,
    };

    // Filtrar campos no definidos
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined),
    );

    if (Object.keys(filteredUpdateData).length === 0) {
      throw new ConflictException(
        'No se proporcionaron campos para actualizar.',
      );
    }

    await this.transactionsCollection
      .doc(transactionId)
      .update(filteredUpdateData);

    const updatedTransactionDoc = await this.transactionsCollection
      .doc(transactionId)
      .get();

    return this.toTransaction(updatedTransactionDoc);
  }
}
