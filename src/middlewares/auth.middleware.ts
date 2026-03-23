import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AuthenticationError, ForbiddenError } from '../utils/customErrors';

/**
 * Valida el JWT enviado en el header Authorization.
 * Si es valido, agrega `req.user` para las rutas protegidas.
 */
export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AuthenticationError('Acceso denegado. No se proporciono un token.'));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = decoded; 

    next();
  } catch (error) {
    next(new ForbiddenError('Token invalido o expirado.'));
  }
};