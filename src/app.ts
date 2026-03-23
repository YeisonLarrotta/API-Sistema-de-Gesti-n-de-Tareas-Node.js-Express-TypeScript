import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './utils/customErrors';
import authRoutes from './api/auth.routes';
import taskRoutes from './api/task.routes';
import { swaggerSpec } from './docs/swagger';

const app: Application = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'UP', message: 'Servidor funcionando correctamente' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use((req, res, next) => {
  next(new NotFoundError(`La ruta ${req.originalUrl} no existe`));
});

app.use(errorHandler);

export default app;
