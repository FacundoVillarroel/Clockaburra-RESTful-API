const express = require("express");
const multer = require("multer");

const ImagesRouter = express.Router();
const imagesController = require("../controllers/imagesController");

const upload = multer({
  storage: multer.memoryStorage(), // Save the file temporarily in memory
});

ImagesRouter.post(
  "/profile-images",
  upload.single("image"),
  imagesController.uploadImage
);

module.exports = ImagesRouter;
