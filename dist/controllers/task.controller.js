"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.completeTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_service_1 = require("../services/task.service");
const customErrors_1 = require("../utils/customErrors");
const taskService = new task_service_1.TaskService();
/**
 * Crea una tarea asociada al usuario autenticado.
 */
const createTask = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { titulo, descripcion, fecha_vencimiento, estado } = req.body;
        if (!titulo) {
            return res.status(400).json({ error: 'El título es obligatorio' });
        }
        const newTask = await taskService.createTask(userId, titulo, descripcion, fecha_vencimiento, estado);
        res.status(201).json({
            message: 'Tarea creada con éxito',
            task: newTask
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
// --- OBTENER TAREAS ---
const getTasks = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const tasks = await taskService.getTasksByUser(userId);
        res.json(tasks);
    }
    catch (error) {
        next(error);
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res, next) => {
    try {
        const taskId = Number(req.params.id);
        const userId = req.user.id;
        if (Number.isNaN(taskId)) {
            return res.status(400).json({ error: 'El id de la tarea debe ser numérico' });
        }
        const task = await taskService.getTaskById(taskId, userId);
        if (!task) {
            return next(new customErrors_1.NotFoundError('Tarea no encontrada o no tienes permiso'));
        }
        res.json(task);
    }
    catch (error) {
        next(error);
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res, next) => {
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
            return next(new customErrors_1.NotFoundError('Tarea no encontrada, no tienes permiso o no enviaste campos a actualizar'));
        }
        res.json({ message: 'Tarea actualizada con éxito', task });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
// --- COMPLETAR TAREA (Paso 2 actualizado) ---
const completeTask = async (req, res, next) => {
    try {
        const { id } = req.params; // Sacamos el id de la URL
        const userId = req.user.id; // Sacamos el usuario del token
        const task = await taskService.completeTask(Number(id), userId);
        if (!task) {
            return next(new customErrors_1.NotFoundError('Tarea no encontrada o no tienes permiso'));
        }
        res.json({
            message: 'Tarea completada',
            task
        });
    }
    catch (error) {
        next(error);
    }
};
exports.completeTask = completeTask;
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deletedTask = await taskService.deleteTask(Number(id), userId);
        if (!deletedTask) {
            return next(new customErrors_1.NotFoundError('Tarea no encontrada o no tienes permiso'));
        }
        res.json({ message: 'Tarea eliminada correctamente' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
