import { Injectable } from '@nestjs/common';
import { db } from '../config/firebase.config';

@Injectable()
export class FirestoreService {
  async create(collection: string, data: any) {
    const docRef = await db.collection(collection).add(data);
    return docRef.id;
  }

  async findOne(collection: string, id: string) {
    const docRef = db.collection(collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return null;
    }
    return doc.data();
  }

  async update(collection: string, id: string, data: any) {
    const docRef = db.collection(collection).doc(id);
    await docRef.update(data);
  }

  async delete(collection: string, id: string) {
    const docRef = db.collection(collection).doc(id);
    await docRef.delete();
  }
}