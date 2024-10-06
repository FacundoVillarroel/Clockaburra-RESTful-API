const { Storage } = require("@google-cloud/storage");

const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Firebase Storage config
const storage = new Storage({
  projectId: firebaseCredentials.project_id,
  credentials: {
    client_email: firebaseCredentials.client_email,
    private_key: firebaseCredentials.private_key,
  },
});
const bucketURL = process.env.STORAGE_BUCKET_URL;
const bucket = storage.bucket(`gs://${bucketURL}`);

class ImagesService {
  static async uploadImageToFirebase(file) {
    return new Promise((resolve, reject) => {
      // Define the file name with a unique timestamp to avoid conflicts
      const blob = bucket.file(
        `profile-images/${Date.now()}_${file.originalname}`
      );

      // Create an upload stream
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      blobStream.on("error", (err) => {
        reject(err);
      });

      // When the upload is complete, we get the public URL of the file
      blobStream.on("finish", () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }
}

module.exports = ImagesService;
