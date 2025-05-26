import admin from"firebase-admin";

import { Firestore, CollectionReference, Query, DocumentData } from "firebase-admin/firestore";

import { AppError } from "../errors/AppError";
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "../errors/HttpErrors";

const firebaseData = process.env.FIREBASE_CREDENTIALS;
if (!firebaseData) {
  throw new Error("Firebase credentials not found");
}
const serviceAccount = JSON.parse(firebaseData);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export interface Condition {
  field: string;
  operator: FirebaseFirestore.WhereFilterOp;
  value: any;
}

export default class FirebaseConfig<T extends DocumentData> {
  private db: Firestore;
  private query: CollectionReference<T>;

  constructor(collection: string) {
    this.db = admin.firestore();
    this.query = this.db.collection(collection) as CollectionReference<T>;
  }

  async getAll(): Promise<T[] | null> {
    try {
      const docs = await this.query.get();
      if (!docs) {
        return null;
      } else {
        return docs.docs.map((doc) => {
          const data = { ...doc.data(), id: doc.id };
          return data;
        });
      }
    } catch (error: any) {
      throw new InternalServerError(error.message || "Error getting documents");
    }
  }

  async save(doc: T & { id?: string }): Promise<{ data: T; id: string }> {
    try {
      if (doc.id) {
        const itemToAdd = this.query.doc(`${doc.id}`);
        await itemToAdd.create(doc);
        return { data: doc, id: doc.id };
      } else {
        const response = await this.query.add(doc);
        return { data: doc, id: response.id };
      }
    } catch (error: any) {
      if (error.code === 6) {
        throw new ConflictError("Document already exists");
      }
      throw new InternalServerError(error.message || "Error saving document");
    }
  }

  async getById(id: string): Promise<T & { id: string }> {
    try {
      const docFound = await this.query.doc(`${id}`).get();
      if (!docFound.data()) {
        throw new NotFoundError(`Document with id ${id}`);
      }
      const dataFound = docFound.data();
      if (!dataFound) {
        throw new NotFoundError(`Document with id ${id}`);
      }
      const doc = { ...dataFound, id: docFound.id };
      return doc;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(error.message || "Error getting document");
    }
  }

  async filterByConditions(
    conditions: Condition[]
  ): Promise<(T & { id: string })[]> {
    try {
      let queryRef: Query<T> = this.query;

      conditions.forEach((condition) => {
        queryRef = queryRef.where(
          condition.field,
          condition.operator,
          condition.value
        );
      });

      const snapshot = await queryRef.get();
      if (snapshot.empty) {
        return [];
      }
      const docsFound = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return docsFound;
    } catch (error: any) {
      throw new InternalServerError(
        error.message || "Error getting filtered documents"
      );
    }
  }

  async updateById(id: string, update: Partial<T>): Promise<void> {
    try {
      const currentDoc = this.query.doc(`${id}`);
      await currentDoc.update({ ...update });
    } catch (error: any) {
      throw new InternalServerError(error.message || "Error updating document");
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      const docRef = this.query.doc(`${id}`);
      const docSnapshot = await docRef.get();
      if (docSnapshot.exists) {
        await docRef.delete();
      } else {
        throw new NotFoundError(`Document with id ${id}`);
      }
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(error.message || "Error deleting document");
    }
  }
}

