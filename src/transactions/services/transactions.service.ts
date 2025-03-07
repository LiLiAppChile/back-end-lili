import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { db } from '../../config/firebase.config';
import { Transaction } from '../models/transactions.model';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  private readonly transactionsCollection = db.collection('transactions');

  private toTransaction(doc: FirebaseFirestore.DocumentSnapshot): Transaction {
    const data = doc.data();
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
      data.professionalAmount
    );
  }

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {

    const existingTransaction = await this.transactionsCollection
      .where('requestId', '==', createTransactionDto.requestId)
      .get();

    if (!existingTransaction.empty) {
      throw new ConflictException(`Ya existe una transacción con el requestId: ${createTransactionDto.requestId}`);
    }

    try{
      const platformFeeAmount = (createTransactionDto.platformFee / 100) * createTransactionDto.professionalAmount;
      const totalAmount = createTransactionDto.professionalAmount + platformFeeAmount;

      const transactionData = {
        requestId: createTransactionDto.requestId,  //Ahora si se incluye el requestID
        amount: totalAmount,
        paymentDate: createTransactionDto.paymentDate || new Date().toISOString(),
        paymentStatus: 'pendiente',
        paymentMethod: createTransactionDto.paymentMethod,
        platformFee: createTransactionDto.platformFee,
        professionalAmount: createTransactionDto.professionalAmount,
      };
    const transactionRef = await this.transactionsCollection.add(transactionData);
    const transactionDoc = await transactionRef.get();
      return this.toTransaction(transactionDoc);

    } catch (error) {
        console.error('Error en la creación de la transacción:', error);
      throw new ConflictException(error.message || 'Error al crear la transacción');
    }
  }


async getTransactionById(transactionId: string): Promise<Transaction> {
  const transactionDoc = await this.transactionsCollection.doc(transactionId).get();
  if (!transactionDoc.exists) {
    throw new NotFoundException(`Transacción con ID ${transactionId} no encontrada`);
  }
  return this.toTransaction(transactionDoc);
}

async markTransactionAsCompleted(transactionId: string): Promise<Transaction> {
    const transactionDoc = await this.transactionsCollection.doc(transactionId).get();
    if (!transactionDoc.exists) {
      throw new NotFoundException(`Transacción con ID ${transactionId} no encontrada`);
    }
    const currentStatus = transactionDoc.data()?.paymentStatus;
    if (currentStatus === 'completado') {
      throw new ConflictException('La transacción ya está completada.');
    }
     if (currentStatus === 'reembolsado') {
       throw new ConflictException('La transacción ya ha sido reembolsada y no se puede completar.');
     }

    await this.transactionsCollection.doc(transactionId).update({ paymentStatus: 'completado' });
    const updatedTransactionDoc = await this.transactionsCollection.doc(transactionId).get();

    return this.toTransaction(updatedTransactionDoc);
}

async markTransactionAsRefunded(transactionId: string): Promise<Transaction> {
    const transactionDoc = await this.transactionsCollection.doc(transactionId).get();
    if (!transactionDoc.exists) {
      throw new NotFoundException(`Transacción con ID ${transactionId} no encontrada`);
    }
     const currentStatus = transactionDoc.data()?.paymentStatus;
     if (currentStatus === 'reembolsado') {
          throw new ConflictException('La transacción ya ha sido reembolsada.');
      }
      if (currentStatus === 'pendiente') {
          throw new ConflictException('La transacción debe estar completada para ser reembolsada.');
      }
    await this.transactionsCollection.doc(transactionId).update({ paymentStatus: 'reembolsado' });
    const updatedTransactionDoc = await this.transactionsCollection.doc(transactionId).get();

    return this.toTransaction(updatedTransactionDoc);
}


  async getAllTransactions(): Promise<Transaction[]> {
    const snapshot = await this.transactionsCollection.get();
    return snapshot.docs.map((doc) => this.toTransaction(doc));
  }

  async updateTransaction(transactionId: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transactionDoc = await this.transactionsCollection.doc(transactionId).get();
      if (!transactionDoc.exists) {
        throw new NotFoundException(`Transacción con ID ${transactionId} no encontrada`);
    }
    const existingData = transactionDoc.data();
    if (!existingData) {
      throw new NotFoundException(`Datos de la transacción con ID ${transactionId} no encontrados`);
    }

    const updateData: any = {};

    if (updateTransactionDto.paymentStatus !== undefined) {
      updateData.paymentStatus = updateTransactionDto.paymentStatus;
    }
    if (updateTransactionDto.paymentMethod !== undefined) {
      updateData.paymentMethod = updateTransactionDto.paymentMethod;
    }
     if (updateTransactionDto.professionalAmount !== undefined ) {
        const newPlatformFeeAmount = (existingData.platformFee / 100) * updateTransactionDto.professionalAmount;
        const newTotalAmount = updateTransactionDto.professionalAmount + newPlatformFeeAmount;

        updateData.professionalAmount = updateTransactionDto.professionalAmount;
        updateData.amount = newTotalAmount;
    }
      if (updateTransactionDto.platformFee !== undefined) {
        const newPlatformFeeAmount = (updateTransactionDto.platformFee / 100) * existingData.professionalAmount;
        const newTotalAmount = existingData.professionalAmount + newPlatformFeeAmount;

        updateData.platformFee = updateTransactionDto.platformFee;
        updateData.amount = newTotalAmount;
    }

    await this.transactionsCollection.doc(transactionId).update(updateData);

    const updatedTransactionDoc = await this.transactionsCollection.doc(transactionId).get();
    return this.toTransaction(updatedTransactionDoc);
  }

}