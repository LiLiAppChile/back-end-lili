export class User {
  public uid: string;
  public name: string;
  public email: string;
  public phone: string;
  public createdAt?: string;
  public delete: boolean;
  public validUser: boolean;
  
  public rut: string;
  public commune?: string;
  public siiRegistered?: boolean;
  public hasTools?: boolean;
  public ownTransportation?: boolean;
  public specialties: string[];
  public professionalExperience?: string;
  public personalDescription?: string;
  public workAreas?: string[];
  public availability?: { [key: string]: string };
  public profilePicture?: string;
  public backgroundCertificate?: { url: string };
  public identityCard?: { frontUrl: string; backUrl: string };
  public additionalCertificate?: { url: string };
  public contactSource?: string;

  constructor(
    uid: string,
    name: string,
    email: string,
    phone: string,
    rut: string,
    specialties: string[],
    options?: {
      createdAt?: string;
      delete?: boolean;
      validUser?: boolean;
      commune?: string;
      siiRegistered?: boolean;
      hasTools?: boolean;
      ownTransportation?: boolean;
      professionalExperience?: string;
      personalDescription?: string;
      workAreas?: string[];
      availability?: { [key: string]: string };
      profilePicture?: string;
      backgroundCertificate?: { url: string };
      identityCard?: { frontUrl: string; backUrl: string };
      additionalCertificate?: { url: string };
      contactSource?: string;
    }
  ) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.rut = rut;
    this.specialties = specialties;
    this.createdAt = options?.createdAt;
    this.delete = options?.delete ?? false;
    this.validUser = options?.validUser ?? false;

    this.commune = options?.commune;
    this.siiRegistered = options?.siiRegistered;
    this.hasTools = options?.hasTools;
    this.ownTransportation = options?.ownTransportation;
    this.professionalExperience = options?.professionalExperience;
    this.personalDescription = options?.personalDescription;
    this.workAreas = options?.workAreas;
    this.availability = options?.availability;
    this.profilePicture = options?.profilePicture;
    this.backgroundCertificate = options?.backgroundCertificate;
    this.identityCard = options?.identityCard;
    this.additionalCertificate = options?.additionalCertificate;
    this.contactSource = options?.contactSource;
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
}