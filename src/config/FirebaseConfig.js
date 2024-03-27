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

  async save(item) {
    try {
      const res = await this.query.add(item);
      return res.id;
    } catch (err) {
      console.log(err);
    }
  }

  async getAll() {
    const users = await this.query.get();
    return users.docs.map((doc) => doc.data());
  }
}

module.exports = FirebaseConfig;
