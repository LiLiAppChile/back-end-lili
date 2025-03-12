import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { db } from '../../config/firebase.config';
import { User } from '../models/users.model';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly usersCollection = db.collection('users');

  private toUser(doc: FirebaseFirestore.DocumentSnapshot): User {
    const data = doc.data();
    if (!data) {
      throw new Error('Los datos del usuario no existen');
    }
    return new User(
      doc.id,
      data.name,
      data.email,
      data.phone,
      data.rut,
      data.specialties,
      {
        createdAt: data.createdAt,
        delete: data.delete,
        validUser: data.validUser,
        commune: data.commune,
        siiRegistered: data.siiRegistered,
        hasTools: data.hasTools,
        ownTransportation: data.ownTransportation,
        professionalExperience: data.professionalExperience,
        personalDescription: data.personalDescription,
        workAreas: data.workAreas,
        availability: data.availability,
        profilePicture: data.profilePicture,
        backgroundCertificate: data.backgroundCertificate,
        identityCard: data.identityCard,
        additionalCertificate: data.additionalCertificate,
        contactSource: data.contactSource,
      }
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userData = {
      name: createUserDto.name,
      email: createUserDto.email,
      phone: createUserDto.phone,
      rut: createUserDto.rut,
      specialties: createUserDto.specialties,
      createdAt: new Date().toISOString(),
      delete: createUserDto.delete || false,
      validUser: false,
      commune: createUserDto.commune,
      siiRegistered: createUserDto.siiRegistered || false,
      hasTools: createUserDto.hasTools || false,
      ownTransportation: createUserDto.ownTransportation || false,
      professionalExperience: '',
      personalDescription: '',
      workAreas: [],
      availability: {},
      profilePicture: '',
      backgroundCertificate: { url: '' },
      identityCard: { frontUrl: '', backUrl: '' },
      additionalCertificate: { url: '' },
      contactSource: '',
      };

      await this.usersCollection.doc(createUserDto.uid).set(userData);

      return new User(
        createUserDto.uid,
        userData.name,
        userData.email,
        userData.phone,
        userData.rut,
        userData.specialties,
        {
          createdAt: userData.createdAt,
          delete: userData.delete,
          validUser: userData.validUser,
          commune: userData.commune,
          siiRegistered: userData.siiRegistered,
          hasTools: userData.hasTools,
          ownTransportation: userData.ownTransportation,
          professionalExperience: userData.professionalExperience,
          personalDescription: userData.personalDescription,
          workAreas: userData.workAreas,
          availability: userData.availability,
          profilePicture: userData.profilePicture,
          backgroundCertificate: userData.backgroundCertificate,
          identityCard: userData.identityCard,
          additionalCertificate: userData.additionalCertificate,
          contactSource: userData.contactSource,
        }
      );
    } catch (error: any) {
      console.error('Error en la creación de usuario:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
      throw error;
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
        commune: updateUserDto.commune,
        siiRegistered: updateUserDto.siiRegistered,
        hasTools: updateUserDto.hasTools,
        ownTransportation: updateUserDto.ownTransportation,
        specialties: updateUserDto.specialties,
        professionalExperience: updateUserDto.professionalExperience,
        personalDescription: updateUserDto.personalDescription,
        workAreas: updateUserDto.workAreas,
        availability: updateUserDto.availability,
        profilePicture: updateUserDto.profilePicture,
        backgroundCertificate: updateUserDto.backgroundCertificate,
        identityCard: updateUserDto.identityCard,
        additionalCertificate: updateUserDto.additionalCertificate,
        contactSource: updateUserDto.contactSource,
      };

      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
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