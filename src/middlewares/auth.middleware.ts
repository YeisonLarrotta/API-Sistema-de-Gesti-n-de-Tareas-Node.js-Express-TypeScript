import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AuthenticationError, ForbiddenError } from '../utils/customErrors';

/**
 * Valida el JWT enviado en el header Authorization.
 * Si es valido, agrega `req.user` para las rutas protegidas.
 */
export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  // 1. Obtener el token del header (Bearer Token)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AuthenticationError('Acceso denegado. No se proporciono un token.'));
  }

  try {
    // 2. Verificar si el token es válido
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // 3. Guardar los datos del usuario dentro de la petición para usarlo después
    req.user = decoded; 
    
    // 4. Continuar al siguiente paso (el controlador)
    next();
  } catch (error) {
    next(new ForbiddenError('Token invalido o expirado.'));
  }
};