import express from "express";
import multer from "multer";

const ImagesRouter = express.Router();
import * as imagesController from "../controllers/imagesController";

const upload = multer({
  storage: multer.memoryStorage(), // Save the file temporarily in memory
});

ImagesRouter.put(
  "/profile-images",
  upload.single("image"),
  imagesController.uploadImage
);

ImagesRouter.delete("/profile-images/:filePath", imagesController.deleteImage);

export default ImagesRouter;
