import { Request } from 'express';

/**
 * Interfaz para requests autenticados.
 * El middleware authenticateToken agrega la propiedad user al request.
 */
export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

/**
 * Tipo para el payload del JWT.
 */
export interface JWTPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}
