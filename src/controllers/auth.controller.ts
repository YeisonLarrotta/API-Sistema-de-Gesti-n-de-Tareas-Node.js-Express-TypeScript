import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { logger } from '../utils/logger';
import { AppError, AuthenticationError, ConflictError } from '../utils/customErrors';

const authService = new AuthService();

/**
 * Registra un nuevo usuario y devuelve sus datos publicos.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, email, password } = req.body;
    const user = await authService.register(nombre, email, password);
    
    res.status(201).json({ 
      message: 'Usuario creado con éxito', 
      user 
    });
  } catch (error: any) {
    logger.error('DETALLE DEL ERROR REGISTRO', error?.message);
    if (error instanceof AppError) return next(error);
    if (error?.code === '23505') return next(new ConflictError('El email ya esta registrado'));
    return next(error);
  }
};

/**
 * Valida credenciales y entrega un JWT.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      message: 'Login exitoso',
      ...result
    });
  } catch (error: any) {
    logger.error('DETALLE DEL ERROR LOGIN', error?.message);
    if (error instanceof AppError) return next(error);
    return next(new AuthenticationError(error?.message ?? 'Credenciales invalidas'));
  }
};