import { Router, RequestHandler } from 'express';
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
router.post('/', authenticateToken, validate(createTaskSchema), createTask as unknown as RequestHandler);
router.get('/', authenticateToken, getTasks as unknown as RequestHandler);
router.get('/:id', authenticateToken, validate(taskIdParamSchema, 'params'), getTaskById as unknown as RequestHandler);
router.put(
  '/:id',
  authenticateToken,
  validate(taskIdParamSchema, 'params'),
  validate(updateTaskSchema),
  updateTask as unknown as RequestHandler
);
router.delete('/:id', authenticateToken, validate(taskIdParamSchema, 'params'), deleteTask as unknown as RequestHandler);
router.patch(
  '/:id/complete',
  authenticateToken,
  validate(taskIdParamSchema, 'params'),
  completeTask as unknown as RequestHandler
);

export default router;