const ImagesService = require("../service/ImagesService");

class ImagesController {
  static async uploadImage(req, res, next) {
    try {
      // verify if there is a file
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Call the service to upload the image and get the URL
      const imageUrl = await ImagesService.uploadImageToFirebase(req.file);

      res.status(200).json(imageUrl);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Error uploading image" });
    }
  }

  static async deleteImage(req, res, next) {
    try {
      const filePath = req.params.filePath;
      if (!filePath) return res.status(400).send("invalid filePath");
      await ImagesService.deleteImage(filePath);
      res.send({ message: "Image deleted successfully", deleted: true });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.mesagge });
    }
  }
}

module.exports = ImagesController;
