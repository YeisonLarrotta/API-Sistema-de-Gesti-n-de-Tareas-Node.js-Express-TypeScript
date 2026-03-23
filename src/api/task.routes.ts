import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  completeTask,
  deleteTask,
} from '../controllers/task.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createTaskSchema,
  taskIdParamSchema,
  updateTaskSchema,
} from '../validations/task.schemas';

const router = Router();

// Todas las rutas de tareas requieren JWT valido.
router.post('/', authenticateToken, validate(createTaskSchema), createTask);
router.get('/', authenticateToken, getTasks);
router.get('/:id', authenticateToken, validate(taskIdParamSchema, 'params'), getTaskById);
router.put(
  '/:id',
  authenticateToken,
  validate(taskIdParamSchema, 'params'),
  validate(updateTaskSchema),
  updateTask
);
router.delete('/:id', authenticateToken, validate(taskIdParamSchema, 'params'), deleteTask);
router.patch(
  '/:id/complete',
  authenticateToken,
  validate(taskIdParamSchema, 'params'),
  completeTask
);

export default router;