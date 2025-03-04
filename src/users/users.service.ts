import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../config/firebase.config';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly usersCollection = db.collection('users');

  async create(createUserDto: User): Promise<User> {
    try {
      const userData = {
        ...createUserDto,
        createdAt: new Date().toISOString(),
      };

      const userRef = await this.usersCollection.add(userData);

      return {
        id: userRef.id,
        ...userData,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.usersCollection.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  }

  async findOne(id: string): Promise<User> {
    const userDoc = await this.usersCollection.doc(id).get();
    if (!userDoc.exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      id: userDoc.id,
      ...userDoc.data(),
    } as User;
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    const userDoc = await this.usersCollection.doc(id).get();
    if (!userDoc.exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.usersCollection.doc(id).update(updateUserDto);

    const updatedUserDoc = await this.usersCollection.doc(id).get();
    return {
      id: updatedUserDoc.id,
      ...updatedUserDoc.data(),
    } as User;
  }

  async delete(id: string): Promise<void> {
    const userDoc = await this.usersCollection.doc(id).get();
    if (!userDoc.exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersCollection.doc(id).delete();
  }
}
