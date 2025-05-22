import { Storage } from "@google-cloud/storage";
import type { StorageOptions } from "@google-cloud/storage";
import type { Express } from "express";

if (!process.env.FIREBASE_CREDENTIALS) {
  throw new Error(
    "FIREBASE_CREDENTIALS environment variable is not defined"
  );
}

const firebaseCredentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Firebase Storage config
const storageOptions: StorageOptions = {
  projectId: firebaseCredentials.project_id,
  credentials: {
    client_email: firebaseCredentials.client_email,
    private_key: firebaseCredentials.private_key,
  },
}
const storage = new Storage(storageOptions);

const bucketURL = process.env.STORAGE_BUCKET_URL;
if (!bucketURL) {
  throw new Error(
    "STORAGE_BUCKET_URL environment variable is not defined"
  );
}
const bucket = storage.bucket(`gs://${bucketURL}`);

class ImagesService {
  static async uploadImageToFirebase(file: Express.Multer.File) : Promise<string> {
    try {
      // Define the file name with a unique timestamp to avoid conflicts
      const blob = bucket.file(
        `profile-images/${Date.now()}_${file.originalname}`
      );

      // Create an upload stream
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      return new Promise((resolve, reject) => {
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

        // Finalize the write stream with the file buffer
        blobStream.end(file.buffer);
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  static async deleteImage(filePath:string) : Promise<void> {
    try {
      await bucket.file(filePath).delete();
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      throw error;
    }
  }
}

module.exports = ImagesService;
