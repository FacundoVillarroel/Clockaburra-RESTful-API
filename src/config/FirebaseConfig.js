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
    } catch (err) {
      console.log(err);
    }
  }

  async save(doc) {
    try {
      const itemToAdd = this.query.doc(`${doc.id}`);
      await itemToAdd.create(doc);
      return { data: doc, id: doc.id };
    } catch (error) {
      console.log(error);
      const errorMessage = error.details.split(": ")[0];
      return { error: errorMessage };
    }
  }
}

module.exports = FirebaseConfig;
