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
  public identityCard: { frontUrl: string; backUrl: string } | null;
  public additionalCertificate: { url: string } | null;
  public contactSource: string | null;
  public status: string;

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
      identityCard?: { frontUrl: string; backUrl: string } | null;
      additionalCertificate?: { url: string } | null;
      contactSource?: string | null;
      status?: string;
    }
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
    this.identityCard = options?.identityCard ?? null;
    this.additionalCertificate = options?.additionalCertificate ?? null;
    this.contactSource = options?.contactSource ?? null;
    this.status = options?.status ?? 'pending';
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
      identityCard: this.identityCard,
      additionalCertificate: this.additionalCertificate,
      contactSource: this.contactSource,
      status: this.status
    };
  }
}