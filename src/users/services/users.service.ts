import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { db } from '../../config/firebase.config';
import { User } from '../models/users.model';

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
      {
        createdAt: data.createdAt,
        delete: data.delete,
        validUser: data.validUser,
      }
    );
  }

  async create(createUserDto: User): Promise<User> {
    try {
      const userData = {
        name: createUserDto.name,
        email: createUserDto.email,
        phone: createUserDto.phone,
        createdAt: new Date().toISOString(),
        delete: createUserDto.delete || false,
        validUser: createUserDto.validUser || false,
      };

      const userRef = await this.usersCollection.doc(createUserDto.uid).set(userData);

      return new User(
        createUserDto.uid,
        userData.name,
        userData.email,
        userData.phone,
        {
          createdAt: userData.createdAt,
          delete: userData.delete,
          validUser: userData.validUser,
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

  async update(uid: string, updateUserDto: Partial<User>): Promise<User> {
    try {
      const userDoc = await this.usersCollection.doc(uid).get();
      if (!userDoc.exists) {
        throw new NotFoundException(`Usuario con UID ${uid} no encontrado`);
      }

      await this.usersCollection.doc(uid).update(updateUserDto);

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