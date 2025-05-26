import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).send({
      ok: false,
      message: err.message,
    });
    return
  }

  // unknown error
  console.error('Unhandled error:', err);

  res.status(500).send({
    ok: false,
    message: 'Internal server error',
  });
  return
};

export default errorHandler;