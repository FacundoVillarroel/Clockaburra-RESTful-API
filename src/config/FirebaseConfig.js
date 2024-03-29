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
      const users = await this.query.get();
      if (!users) {
        return null;
      } else {
        return users.docs.map((doc) => doc.data());
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async save(doc) {
    try {
      const itemToAdd = this.query.doc(`${doc.id}`);
      await itemToAdd.create(doc);
      return { data: doc, id: doc.id };
    } catch (error) {
      if (error.code === 6) {
        throw new Error("Document already exists");
      } else {
        throw new Error(error.message);
      }
    }
  }

  async getById(id) {
    try {
      const docFound = await (await this.query.doc(`${id}`).get()).data();
      if (!docFound) {
        throw new Error(`there is no user with the id: ${id}`);
      }
      return docFound;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateById(id, update) {
    try {
      const currentDoc = await this.query.doc(`${id}`);
      await currentDoc.update({ ...update });
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async deleteById(id) {
    try {
      const docRef = await this.query.doc(`${id}`);
      const docSnapshot = await docRef.get();
      if (docSnapshot.exists) {
        await docRef.delete();
      } else {
        throw new Error(`there is no user with the id: ${id}`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = FirebaseConfig;
