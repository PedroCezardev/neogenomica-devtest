import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Rotas públicas — sem autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas protegidas — requerem token JWT válido no header Authorization: Bearer <token>
router.get('/me', authMiddleware, authController.getProfile);
router.get('/usuarios', authMiddleware, authController.findAll);

export default router;
