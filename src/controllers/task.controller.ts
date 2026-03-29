import { NextFunction, Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { AuthenticatedRequest } from '../types/express';

const taskService = new TaskService();

/**
 * Crea una tarea asociada al usuario autenticado.
 */
export const createTask = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { titulo, descripcion, fecha_vencimiento, estado } = req.body;

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
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getTasksByUser(userId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;

    const task = await taskService.getTaskById(taskId, userId);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;
    const { titulo, descripcion, fecha_vencimiento, estado } = req.body;

    const task = await taskService.updateTask(taskId, userId, {
      titulo,
      descripcion,
      fecha_vencimiento,
      estado,
    });

    res.json({ message: 'Tarea actualizada con éxito', task });
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;
    
    const task = await taskService.completeTask(taskId, userId);
    
    res.json({ 
      message: 'Tarea completada', 
      task 
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;

    await taskService.deleteTask(taskId, userId);

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};