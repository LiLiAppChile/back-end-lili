export class User {
  public uid: string;
  public name: string;
  public email: string;
  public phone: string;
  public createdAt?: string;
  public delete: boolean;
  public validUser: boolean;

  constructor(
    uid: string,
    name: string,
    email: string,
    phone: string,
    options?: {
      createdAt?: string;
      delete?: boolean;
      validUser?: boolean;
    }
  ) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.createdAt = options?.createdAt;
    this.delete = options?.delete ?? false;
    this.validUser = options?.validUser ?? false;
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