import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { UserRepository } from '../repositories/user.repository';
import { AuthenticationError, ConflictError } from '../utils/customErrors';
import { logger } from '../utils/logger';

// Constantes de configuracion de seguridad
const SALT_ROUNDS = 12;
const JWT_EXPIRES_IN = '2h';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    nombre: string;
    email: string;
  };
}

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  /**
   * Registra un usuario nuevo y devuelve datos publicos.
   * @throws {ConflictError} Si el email ya esta registrado
   */
  async register(nombre: string, email: string, password: string) {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AuthenticationError('Formato de email invalido');
    }

    // Validar longitud de password
    if (password.length < 6) {
      throw new AuthenticationError('La contraseña debe tener al menos 6 caracteres');
    }

    // Verificar si el email ya existe
    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new ConflictError('El email ya esta registrado');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    try {
      const user = await this.userRepository.create({
        nombre,
        email,
        password: hashedPassword
      });
      
      logger.info(`Usuario registrado exitosamente: ${email}`);
      return user;
    } catch (error) {
      logger.error('Error al crear usuario en base de datos', error);
      throw new AuthenticationError('Error al registrar usuario');
    }
  }

  /**
   * Valida email y password y devuelve token JWT + perfil basico.
   * @throws {AuthenticationError} Si las credenciales son invalidas
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Mensaje generico para no revelar si el usuario existe
      throw new AuthenticationError('Credenciales invalidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError('Credenciales invalidas');
    }

    // Genera un token corto de sesion para operaciones autenticadas.
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info(`Login exitoso: ${email}`);

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    };
  }
}