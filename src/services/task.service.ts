import { TaskRepository, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../repositories/task.repository';
import { NotFoundError } from '../utils/customErrors';
import { logger } from '../utils/logger';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository = new TaskRepository()) {
    this.taskRepository = taskRepository;
  }

  /**
   * Crea una tarea para un usuario especifico.
   * @throws {Error} Si el titulo esta vacio
   */
  async createTask(
    userId: number,
    titulo: string,
    descripcion?: string,
    fechaVencimiento?: string,
    estado: TaskStatus = 'pendiente'
  ) {
    if (!titulo || titulo.trim().length === 0) {
      throw new Error('El titulo es obligatorio');
    }

    const input: CreateTaskInput = {
      userId,
      titulo: titulo.trim(),
      descripcion: descripcion?.trim(),
      fechaVencimiento,
      estado
    };

    const task = await this.taskRepository.create(input);
    logger.info(`Tarea creada: ${task.id} por usuario: ${userId}`);
    return task;
  }

  /**
   * Obtiene todas las tareas de un usuario.
   */
  async getTasksByUser(userId: number) {
    return this.taskRepository.findByUserId(userId);
  }

  /**
   * Obtiene una tarea especifica por ID y usuario.
   * @throws {NotFoundError} Si la tarea no existe o no pertenece al usuario
   */
  async getTaskById(taskId: number, userId: number) {
    const task = await this.taskRepository.findByIdAndUserId(taskId, userId);
    if (!task) {
      throw new NotFoundError('Tarea no encontrada o no tienes permiso');
    }
    return task;
  }

  /**
   * Actualiza una tarea existente.
   * @throws {NotFoundError} Si la tarea no existe
   * @throws {Error} Si no hay campos para actualizar
   */
  async updateTask(
    taskId: number,
    userId: number,
    data: UpdateTaskInput
  ) {
    // Validar que haya al menos un campo para actualizar
    const hasFieldsToUpdate = Object.values(data).some(v => v !== undefined);
    if (!hasFieldsToUpdate) {
      throw new Error('No se proporcionaron campos para actualizar');
    }

    const task = await this.taskRepository.update(taskId, userId, data);
    if (!task) {
      throw new NotFoundError('Tarea no encontrada o no tienes permiso');
    }

    logger.info(`Tarea actualizada: ${taskId} por usuario: ${userId}`);
    return task;
  }

  /**
   * Marca una tarea como completada.
   * @throws {NotFoundError} Si la tarea no existe
   */
  async completeTask(taskId: number, userId: number) {
    const task = await this.taskRepository.complete(taskId, userId);
    if (!task) {
      throw new NotFoundError('Tarea no encontrada o no tienes permiso');
    }
    logger.info(`Tarea completada: ${taskId} por usuario: ${userId}`);
    return task;
  }

  /**
   * Elimina una tarea.
   * @throws {NotFoundError} Si la tarea no existe
   */
  async deleteTask(taskId: number, userId: number) {
    const task = await this.taskRepository.delete(taskId, userId);
    if (!task) {
      throw new NotFoundError('Tarea no encontrada o no tienes permiso');
    }
    logger.info(`Tarea eliminada: ${taskId} por usuario: ${userId}`);
    return task;
  }
}
