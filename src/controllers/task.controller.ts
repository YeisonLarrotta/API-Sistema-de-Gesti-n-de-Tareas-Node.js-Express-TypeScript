import { NextFunction, Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { NotFoundError } from '../utils/customErrors';

const taskService = new TaskService();

/**
 * Crea una tarea asociada al usuario autenticado.
 */
export const createTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { titulo, descripcion, fecha_vencimiento, estado } = req.body;

    if (!titulo) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }

    const newTask = await taskService.createTask(
      userId,
      titulo,
      descripcion,
      fecha_vencimiento,
      estado
    );
    
    res.status(201).json({
      message: 'Tarea creada con éxito',
      task: newTask
    });
  } catch (error: any) {
    next(error);
  }
};

// --- OBTENER TAREAS ---
export const getTasks = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getTasksByUser(userId);
    res.json(tasks);
  } catch (error: any) {
    next(error);
  }
};

export const getTaskById = async (req: any, res: Response, next: NextFunction) => {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;

    if (Number.isNaN(taskId)) {
      return res.status(400).json({ error: 'El id de la tarea debe ser numérico' });
    }

    const task = await taskService.getTaskById(taskId, userId);
    if (!task) {
      return next(new NotFoundError('Tarea no encontrada o no tienes permiso'));
    }

    res.json(task);
  } catch (error: any) {
    next(error);
  }
};

export const updateTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;
    const { titulo, descripcion, fecha_vencimiento, estado } = req.body;

    if (Number.isNaN(taskId)) {
      return res.status(400).json({ error: 'El id de la tarea debe ser numérico' });
    }

    const task = await taskService.updateTask(taskId, userId, {
      titulo,
      descripcion,
      fecha_vencimiento,
      estado,
    });

    if (!task) {
      return next(
        new NotFoundError('Tarea no encontrada, no tienes permiso o no enviaste campos a actualizar')
      );
    }

    res.json({ message: 'Tarea actualizada con éxito', task });
  } catch (error: any) {
    next(error);
  }
};

// --- COMPLETAR TAREA (Paso 2 actualizado) ---
export const completeTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Sacamos el id de la URL
    const userId = req.user.id; // Sacamos el usuario del token
    
    const task = await taskService.completeTask(Number(id), userId);
    
    if (!task) {
      return next(new NotFoundError('Tarea no encontrada o no tienes permiso'));
    }
    
    res.json({ 
      message: 'Tarea completada', 
      task 
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteTask = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedTask = await taskService.deleteTask(Number(id), userId);

    if (!deletedTask) {
      return next(new NotFoundError('Tarea no encontrada o no tienes permiso'));
    }

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error: any) {
    next(error);
  }
};