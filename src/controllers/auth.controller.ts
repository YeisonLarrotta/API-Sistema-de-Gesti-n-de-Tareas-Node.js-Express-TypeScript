import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types/express';

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
  } catch (error) {
    // Los errores específicos ya son lanzados por el servicio
    next(error);
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
  } catch (error) {
    // Los errores específicos ya son lanzados por el servicio
    next(error);
  }
};