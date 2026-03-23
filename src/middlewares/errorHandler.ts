import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/customErrors';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Error inesperado (ej. fallo de base de datos)
  logger.error('Error no controlado', err);
  return res.status(500).json({
    status: 'error',
    message: 'Algo salió muy mal en el servidor',
  });
};