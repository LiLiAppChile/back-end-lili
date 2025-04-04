export class User {
  public uid: string;
  public name: string;
  public email: string;
  public phone: string | null;
  public createdAt: string;
  public delete: boolean;
  public validUser: boolean;
  public rut: string | null;
  public commune: string | null;
  public siiRegistered: boolean;
  public hasTools: boolean;
  public ownTransportation: boolean;
  public specialties: string[];
  // Campos opcionales
  public professionalExperience: string | null;
  public personalDescription: string | null;
  public workAreas: string[];
  public availability: { [key: string]: string };
  public profilePicture: string | null;
  public backgroundCertificate: { url: string } | null;
  public identityCardFront: { url: string } | null;
  public identityCardBack: { url: string } | null;
  public additionalCertificate: { url: string } | null;
  public contactSource: string | null;
  public status: string;
  public bankName?: string;
  public accountType?: string;
  public accountHolderName?: string;
  public accountNumber?: number;

  constructor(
    uid: string,
    name: string,
    email: string,
    phone: string | null,
    rut: string | null,
    specialties: string[],
    options?: {
      createdAt?: string;
      delete?: boolean;
      validUser?: boolean;
      commune?: string | null;
      siiRegistered?: boolean;
      hasTools?: boolean;
      ownTransportation?: boolean;
      professionalExperience?: string | null;
      personalDescription?: string | null;
      workAreas?: string[];
      availability?: { [key: string]: string };
      profilePicture?: string | null;
      backgroundCertificate?: { url: string } | null;
      identityCardFront?: { url: string } | null;
      identityCardBack?: { url: string } | null;
      additionalCertificate?: { url: string } | null;
      contactSource?: string | null;
      status?: string;
      bankName?: string;
      accountType?: string;
      accountHolderName?: string;
      accountNumber?: number;
    },
  ) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.phone = phone ?? null;
    this.rut = rut ?? null;
    this.specialties = specialties ?? [];
    this.createdAt = options?.createdAt ?? new Date().toISOString();
    this.delete = options?.delete ?? false;
    this.validUser = options?.validUser ?? false;
    this.commune = options?.commune ?? null;
    this.siiRegistered = options?.siiRegistered ?? false;
    this.hasTools = options?.hasTools ?? false;
    this.ownTransportation = options?.ownTransportation ?? false;
    this.professionalExperience = options?.professionalExperience ?? null;
    this.personalDescription = options?.personalDescription ?? null;
    this.workAreas = options?.workAreas ?? [];
    this.availability = options?.availability ?? {};
    this.profilePicture = options?.profilePicture ?? null;
    this.backgroundCertificate = options?.backgroundCertificate ?? null;
    this.identityCardFront = options?.identityCardFront ?? null;
    this.identityCardBack = options?.identityCardBack ?? null;
    this.additionalCertificate = options?.additionalCertificate ?? null;
    this.contactSource = options?.contactSource ?? null;
    this.status = options?.status ?? 'pending';
    this.bankName = options?.bankName ?? undefined;
    this.accountType = options?.accountType ?? undefined;
    this.accountHolderName = options?.accountHolderName ?? undefined;
    this.accountNumber = options?.accountNumber ?? undefined;
  }

  markAsDeleted(): void {
    this.delete = true;
  }

  validateUser(): void {
    this.validUser = true;
  }

  isUserValid(): boolean {
    return this.validUser;
  }

  toFirestore(): Record<string, any> {
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
      phone: this.phone,
      rut: this.rut,
      specialties: this.specialties,
      createdAt: this.createdAt,
      delete: this.delete,
      validUser: this.validUser,
      commune: this.commune,
      siiRegistered: this.siiRegistered,
      hasTools: this.hasTools,
      ownTransportation: this.ownTransportation,
      professionalExperience: this.professionalExperience,
      personalDescription: this.personalDescription,
      workAreas: this.workAreas,
      availability: this.availability,
      profilePicture: this.profilePicture,
      backgroundCertificate: this.backgroundCertificate,
      identityCardFront: this.identityCardFront,
      identityCardBack: this.identityCardBack,
      additionalCertificate: this.additionalCertificate,
      contactSource: this.contactSource,
      status: this.status,
      bankName: this.bankName,
      accountType: this.accountType,
      accountHolderName: this.accountHolderName,
      accountNumber: this.accountNumber,
    };
  }
}
