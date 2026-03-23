"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const db_1 = require("../persistence/db");
class TaskService {
    /**
     * Crea una tarea para un usuario especifico.
     */
    async createTask(userId, titulo, descripcion, fechaVencimiento, estado = 'pendiente') {
        const query = `
      INSERT INTO tasks (user_id, titulo, descripcion, fecha_vencimiento, estado)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`;
        const values = [userId, titulo, descripcion ?? null, fechaVencimiento ?? null, estado];
        const result = await db_1.pool.query(query, values);
        return result.rows[0];
    }
    async getTasksByUser(userId) {
        const result = await db_1.pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
        return result.rows;
    }
    async getTaskById(taskId, userId) {
        const result = await db_1.pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
        return result.rows[0];
    }
    /**
     * Actualiza solo los campos enviados de una tarea del usuario.
     */
    async updateTask(taskId, userId, data) {
        const fields = [];
        const values = [];
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
        if (!fields.length)
            return null;
        values.push(taskId, userId);
        const query = `
      UPDATE tasks
      SET ${fields.join(', ')}
      WHERE id = $${values.length - 1} AND user_id = $${values.length}
      RETURNING *`;
        const result = await db_1.pool.query(query, values);
        return result.rows[0];
    }
    async completeTask(taskId, userId) {
        const query = 'UPDATE tasks SET estado = $1 WHERE id = $2 AND user_id = $3 RETURNING *';
        const values = ['completada', taskId, userId];
        const result = await db_1.pool.query(query, values);
        return result.rows[0];
    }
    async deleteTask(taskId, userId) {
        const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await db_1.pool.query(query, [taskId, userId]);
        return result.rows[0]; // Si devuelve algo, es que la tarea existía y se borró
    }
}
exports.TaskService = TaskService;
