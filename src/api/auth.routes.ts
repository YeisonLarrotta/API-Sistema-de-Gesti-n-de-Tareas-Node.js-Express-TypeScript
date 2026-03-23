import { Router } from 'express';
import { register, login } from '../controllers/auth.controller'; // Importa login
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validations/auth.schemas';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login); // <-- ¡Añade esta línea!

export default router;