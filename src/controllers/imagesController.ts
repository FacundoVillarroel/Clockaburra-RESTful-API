import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { BadRequestError, InternalServerError } from "../errors/HttpErrors";

import ImagesService from "../service/ImagesService";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // verify if there is a file
    if (!req.file) {
      next(new BadRequestError("No file uploaded"));
      return;
    }
    if (req.body.filePath) {
      const filePath = decodeURIComponent(req.body.filePath);
      await ImagesService.deleteImage(filePath);
    }
    // Call the service to upload the image and get the URL
    const imageUrl = await ImagesService.uploadImageToFirebase(req.file);

    res.status(201).json(imageUrl);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filePath = req.params.filePath;
    if (!filePath) {
      next(new BadRequestError("filePath is required"));
      return;
    }
    await ImagesService.deleteImage(filePath);
    res
      .status(204)
      .send({ message: "Image deleted successfully", deleted: true });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};
