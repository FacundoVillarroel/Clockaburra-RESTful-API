import type { Request, Response } from "express";

import ImagesService from "../service/ImagesService";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    // verify if there is a file
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
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

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const filePath = req.params.filePath;
    if (!filePath) {
      res.status(400).send("invalid filePath");
      return;
    }
    await ImagesService.deleteImage(filePath);
    res.send({ message: "Image deleted successfully", deleted: true });
  } catch (error: any) {
    console.error(error);
    res.status(400).send({ error: error.mesagge });
  }
};
