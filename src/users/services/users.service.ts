import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { db } from '../../config/firebase.config';
import { User } from '../models/users.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly usersCollection = db.collection('users');

  private toUser(doc: FirebaseFirestore.DocumentSnapshot): User {
    const data = doc.data();
    if (!data) {
      throw new Error('Los datos del usuario no existen');
    }
    return new User(doc.id, data.name, data.email, data.phone, data.rut, data.specialties, {
      createdAt: data.createdAt,
      delete: data.delete,
      validUser: data.validUser,
      region: data.region,
      commune: data.commune,
      siiRegistered: data.siiRegistered,
      siiActivitiesStarted: data.siiActivitiesStarted,
      hasTools: data.hasTools,
      ownTransportation: data.ownTransportation,
      professionalExperience: data.professionalExperience,
      personalDescription: data.personalDescription,
      workAreas: data.workAreas,
      availability: data.availability,
      profilePicture: data.profilePicture,
      backgroundCertificate: data.backgroundCertificate,
      identityCardFront: data.identityCardFront,
      identityCardBack: data.identityCardBack,
      additionalCertificate: data.additionalCertificate,
      contactSource: data.contactSource,
      status: data.status,
      bankName: data.bankName,
      accountType: data.accountType,
      accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { uid, email, name, phone, rut, specialties, bankName, accountType, accountHolderName, accountNumber } =
      createUserDto;

    try {
      const userRef = this.usersCollection.doc(uid);
      await userRef.set({
        uid: uid,
        name: name,
        email: email,
        phone: phone,
        rut: rut,
        specialties: specialties,
        createdAt: new Date().toISOString(),
        delete: createUserDto.delete || false,
        validUser: false,
        region: createUserDto.region,
        commune: createUserDto.commune,
        siiRegistered: createUserDto.siiRegistered || false,
        siiActivitiesStarted: createUserDto.siiActivitiesStarted || false,
        hasTools: createUserDto.hasTools || false,
        ownTransportation: createUserDto.ownTransportation || false,
        professionalExperience: '',
        personalDescription: '',
        workAreas: [],
        availability: {},
        profilePicture: '',
        backgroundCertificate: { url: '' },
        identityCardFront: { url: '' },
        identityCardBack: { url: '' },
        additionalCertificate: { url: '' },
        contactSource: '',
        status: 'pending',
        bankName: bankName || '',
        accountType: accountType || '',
        accountHolderName: accountHolderName || '',
        accountNumber: accountNumber || '',
      });

      await userRef.update({ status: 'active' });

      return this.toUser(await userRef.get());
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
      throw new InternalServerErrorException('Error en el registro: ' + error.message);
    }
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.usersCollection.get();
    return snapshot.docs.map((doc) => this.toUser(doc));
  }

  async findOne(uid: string): Promise<User> {
    const userDoc = await this.usersCollection.doc(uid).get();
    if (!userDoc.exists) {
      throw new NotFoundException(`Usuario con UID ${uid} no encontrado`);
    }
    return this.toUser(userDoc);
  }

  async update(uid: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const userDoc = await this.usersCollection.doc(uid).get();
      if (!userDoc.exists) {
        throw new NotFoundException(`Usuario con UID ${uid} no encontrado`);
      }

      if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
        throw new Error('No se proporcionaron datos para actualizar');
      }

      const updateData = {
        name: updateUserDto.name,
        email: updateUserDto.email,
        phone: updateUserDto.phone,
        rut: updateUserDto.rut,
        delete: updateUserDto.delete,
        validUser: updateUserDto.validUser,
        region: updateUserDto.region,
        commune: updateUserDto.commune,
        siiRegistered: updateUserDto.siiRegistered,
        siiActivitiesStarted: updateUserDto.siiActivitiesStarted,
        hasTools: updateUserDto.hasTools,
        ownTransportation: updateUserDto.ownTransportation,
        specialties: updateUserDto.specialties,
        professionalExperience: updateUserDto.professionalExperience,
        personalDescription: updateUserDto.personalDescription,
        workAreas: updateUserDto.workAreas,
        availability: updateUserDto.availability,
        profilePicture: updateUserDto.profilePicture,
        backgroundCertificate: updateUserDto.backgroundCertificate,
        identityCardFront: updateUserDto.identityCardFront,
        identityCardBack: updateUserDto.identityCardBack,
        additionalCertificate: updateUserDto.additionalCertificate,
        contactSource: updateUserDto.contactSource,
        bankName: updateUserDto.bankName,
        accountType: updateUserDto.accountType,
        accountHolderName: updateUserDto.accountHolderName,
        accountNumber: updateUserDto.accountNumber,
      };

      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined),
      );

      if (Object.keys(filteredUpdateData).length === 0) {
        throw new Error('No se proporcionaron campos válidos para actualizar');
      }

      await this.usersCollection.doc(uid).update(filteredUpdateData);

      const updatedUserDoc = await this.usersCollection.doc(uid).get();
      return this.toUser(updatedUserDoc);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  }

  async delete(uid: string): Promise<void> {
    const userDoc = await this.usersCollection.doc(uid).get();
    if (!userDoc.exists) {
      throw new NotFoundException(`Usuario con UID ${uid} no encontrado`);
    }
    await this.usersCollection.doc(uid).delete();
  }
}
