import { Pool, QueryResult } from 'pg';
import { pool } from '../persistence/db';

export type TaskStatus = 'pendiente' | 'en curso' | 'completada';

export interface Task {
  id: number;
  user_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_vencimiento: string | null;
  estado: TaskStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskInput {
  userId: number;
  titulo: string;
  descripcion?: string;
  fechaVencimiento?: string;
  estado?: TaskStatus;
}

export interface UpdateTaskInput {
  titulo?: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  estado?: TaskStatus;
}

export class TaskRepository {
  private pool: Pool;

  constructor(dbPool: Pool = pool) {
    this.pool = dbPool;
  }

  /**
   * Crea una nueva tarea para un usuario.
   */
  async create(input: CreateTaskInput): Promise<Task> {
    const query = `
      INSERT INTO tasks (user_id, titulo, descripcion, fecha_vencimiento, estado)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const values = [
      input.userId,
      input.titulo,
      input.descripcion ?? null,
      input.fechaVencimiento ?? null,
      input.estado ?? 'pendiente'
    ];
    
    const result: QueryResult = await this.pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Obtiene todas las tareas de un usuario.
   */
  async findByUserId(userId: number): Promise<Task[]> {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const result: QueryResult = await this.pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Busca una tarea por ID y verifica que pertenezca al usuario.
   */
  async findByIdAndUserId(taskId: number, userId: number): Promise<Task | null> {
    const query = 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2';
    const result: QueryResult = await this.pool.query(query, [taskId, userId]);
    return result.rows[0] || null;
  }

  /**
   * Actualiza una tarea con los campos proporcionados.
   */
  async update(taskId: number, userId: number, data: UpdateTaskInput): Promise<Task | null> {
    const fields: string[] = [];
    const values: (string | TaskStatus)[] = [];

    if (data.titulo !== undefined) {
      fields.push(`titulo = $${values.length + 1}`);
      values.push(data.titulo);
    }
    if (data.descripcion !== undefined) {
      fields.push(`descripcion = $${values.length + 1}`);
      values.push(data.descripcion);
    }
    if (data.fecha_vencimiento !== undefined) {
      fields.push(`fecha_vencimiento = $${values.length + 1}`);
      values.push(data.fecha_vencimiento);
    }
    if (data.estado !== undefined) {
      fields.push(`estado = $${values.length + 1}`);
      values.push(data.estado);
    }

    if (!fields.length) return null;

    values.push(taskId.toString(), userId.toString());
    const query = `
      UPDATE tasks
      SET ${fields.join(', ')}
      WHERE id = $${values.length - 1} AND user_id = $${values.length}
      RETURNING *
    `;

    const result: QueryResult = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Marca una tarea como completada.
   */
  async complete(taskId: number, userId: number): Promise<Task | null> {
    const query = `
      UPDATE tasks 
      SET estado = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 AND user_id = $3 
      RETURNING *
    `;
    const values: (string | number)[] = ['completada', taskId, userId];
    const result: QueryResult = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Elimina una tarea.
   */
  async delete(taskId: number, userId: number): Promise<Task | null> {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
    const result: QueryResult = await this.pool.query(query, [taskId, userId]);
    return result.rows[0] || null;
  }

  /**
   * Cuenta las tareas de un usuario por estado.
   */
  async countByStatus(userId: number, status: TaskStatus): Promise<number> {
    const query = 'SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND estado = $2';
    const result: QueryResult = await this.pool.query(query, [userId, status]);
    return parseInt(result.rows[0].count, 10);
  }
}
