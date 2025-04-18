const ImagesService = require("../service/ImagesService");

exports.uploadImage = async (req, res, next) => {
  try {
    // verify if there is a file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (req.body.filePath) {
      const filePath = decodeURIComponent(req.body.filePath);
      await ImagesService.deleteImage(filePath);
    }
    // Call the service to upload the image and get the URL
    const imageUrl = await ImagesService.uploadImageToFirebase(req.file);

    res.status(201).json(imageUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error uploading image" });
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const filePath = req.params.filePath;
    if (!filePath) return res.status(400).send("invalid filePath");
    await ImagesService.deleteImage(filePath);
    res.send({ message: "Image deleted successfully", deleted: true });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.mesagge });
  }
};
