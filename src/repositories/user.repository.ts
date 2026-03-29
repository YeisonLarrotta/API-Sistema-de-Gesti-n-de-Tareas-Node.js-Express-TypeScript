import { Pool, QueryResult } from 'pg';
import { pool } from '../persistence/db';

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserInput {
  nombre: string;
  email: string;
  password: string;
}

export class UserRepository {
  private pool: Pool;

  constructor(dbPool: Pool = pool) {
    this.pool = dbPool;
  }

  /**
   * Crea un nuevo usuario y devuelve sus datos publicos.
   */
  async create(input: CreateUserInput): Promise<Omit<User, 'password'>> {
    const query = `
      INSERT INTO users (nombre, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, nombre, email, created_at
    `;
    const values = [input.nombre, input.email, input.password];
    
    const result: QueryResult = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Busca un usuario por su email.
   */
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result: QueryResult = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Busca un usuario por su ID.
   */
  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const query = 'SELECT id, nombre, email, created_at FROM users WHERE id = $1';
    const result: QueryResult = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Verifica si un email ya esta registrado.
   */
  async emailExists(email: string): Promise<boolean> {
    const query = 'SELECT 1 FROM users WHERE email = $1 LIMIT 1';
    const result: QueryResult = await this.pool.query(query, [email]);
    return result.rows.length > 0;
  }
}
