import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../persistence/db';
import { config } from '../config/config';

export class AuthService {
  /**
   * Registra un usuario nuevo y devuelve datos publicos.
   */
  async register(nombre: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email';
    const values = [nombre, email, hashedPassword];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Valida email y password y devuelve token JWT + perfil basico.
   */
  async login(email: string, password: string) {
    // 1. Buscamos al usuario por su email
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    // 2. Si no existe, lanzamos error
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // 3. Comparamos la contraseña que envía Postman con la que está en la DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    // 4. Si todo está OK, creamos el Token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: '2h' } // El token expira en 2 horas
    );

    // 5. Devolvemos el token y los datos básicos del usuario
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