const admin = require("firebase-admin");

const firebaseData = process.env.FIREBASE_CREDENTIALS;
const serviceAccount = JSON.parse(firebaseData);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

class FirebaseConfig {
  constructor(collection) {
    this.db = admin.firestore();
    this.query = this.db.collection(collection);
  }

  async getAll() {
    try {
      const docs = await this.query.get();
      if (!docs) {
        return null;
      } else {
        return docs.docs.map((doc) => {
          const data = doc.data();
          data.id = doc.id;
          return data;
        });
      }
    } catch (error) {
      throw new Error(error.message || "Error getting documents");
    }
  }

  async save(doc) {
    try {
      if (doc.id) {
        const itemToAdd = this.query.doc(`${doc.id}`);
        await itemToAdd.create(doc);
        return { data: doc, id: doc.id };
      } else {
        const response = await this.query.add(doc);
        return { data: doc, id: response.id };
      }
    } catch (error) {
      if (error.code === 6) {
        throw new Error("Document already exists");
      } else {
        throw new Error(error.message || "Error saving document");
      }
    }
  }

  async getById(id) {
    try {
      const docFound = await this.query.doc(`${id}`).get();
      const doc = { ...docFound.data(), id: docFound.id };
      if (!docFound.data()) {
        throw new Error(`there is no document with id: ${id}`);
      }
      return doc;
    } catch (error) {
      throw new Error(error.message || "Error getting document");
    }
  }

  async filterByCondition(field, operator, value) {
    try {
      const snapshot = await this.query.where(field, operator, value).get();
      if (snapshot.empty) {
        throw new Error(
          `there is no document with this condition: ${field} ${operator} ${value}`
        );
      }
      let docsFound = [];
      snapshot.forEach((doc) => {
        docsFound.push({ id: doc.id, ...doc.data() });
      });
      return docsFound;
    } catch (error) {
      throw new Error(error.message || "Error getting documents");
    }
  }

  async updateById(id, update) {
    try {
      const currentDoc = this.query.doc(`${id}`);
      await currentDoc.update({ ...update });
    } catch (error) {
      throw new Error(error.message || "Error updating document");
    }
  }

  async deleteById(id) {
    try {
      const docRef = this.query.doc(`${id}`);
      const docSnapshot = await docRef.get();
      if (docSnapshot.exists) {
        await docRef.delete();
      } else {
        throw new Error(`there is no document with id: ${id}`);
      }
    } catch (error) {
      throw new Error(error.message || "Error deleting document");
    }
  }
}

module.exports = FirebaseConfig;
