export class Transaction {
  public transactionId: string;
  public requestId: string;
  public amount: number;
  public paymentDate: string;
  public paymentStatus: 'pendiente' | 'completado' | 'reembolsado';
  public paymentMethod: string;
  public platformFee: number;
  public professionalAmount: number;

  constructor(
    transactionId: string,
    requestId: string,
    amount: number,
    paymentDate: string,
    paymentStatus: 'pendiente' | 'completado' | 'reembolsado',
    paymentMethod: string,
    platformFee: number,
    professionalAmount: number,
  ) {
    if (amount <= 0) {
      throw new Error('El monto de la transacción debe ser mayor que cero.');
    }
    if (platformFee < 0 || platformFee > 100) {
      throw new Error(
        'La comisión de la plataforma debe ser un porcentaje entre 0 y 100.',
      );
    }
    if (professionalAmount <= 0) {
      throw new Error('El monto para el profesional debe ser mayor que cero.');
    }
    if (professionalAmount >= this.amount) {
      throw new Error(
        'El monto del profesional no puede ser mayor o igual al monto total.',
      );
    }

    this.transactionId = transactionId;
    this.requestId = requestId;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.paymentStatus = paymentStatus;
    this.paymentMethod = paymentMethod;
    this.platformFee = platformFee;
    this.professionalAmount = professionalAmount;
  }

  markAsCompleted(): void {
    if (this.paymentStatus !== 'pendiente') {
      throw new Error(
        'Solo las transacciones pendientes pueden marcarse como completadas.',
      );
    }
    this.paymentStatus = 'completado';
  }

  markAsRefunded(): void {
    if (this.paymentStatus !== 'completado') {
      throw new Error(
        'Solo las transacciones completadas pueden marcarse como reembolsadas.',
      );
    }
    this.paymentStatus = 'reembolsado';
  }

  isCompleted(): boolean {
    return this.paymentStatus === 'completado';
  }
}
