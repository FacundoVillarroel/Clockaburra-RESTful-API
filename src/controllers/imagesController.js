const ImagesService = require("../service/ImagesService");

class ImagesController {
  static async uploadImage(req, res) {
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
      res.status(500).json({ error: "Error uploading image" });
    }
  }
}

module.exports = ImagesController;
