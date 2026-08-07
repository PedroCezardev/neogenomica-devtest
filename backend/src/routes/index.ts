import { Router } from 'express';
import authRoutes from './auth.routes';
import salaRoutes from './sala.routes';
import freezerRoutes from './freezer.routes';
import gavetaRoutes from './gaveta.routes';
import caixaRoutes from './caixa.routes';
import amostraRoutes from './amostra.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/salas', salaRoutes);
router.use('/freezers', freezerRoutes);
router.use('/gavetas', gavetaRoutes);
router.use('/caixas', caixaRoutes);
router.use('/amostras', amostraRoutes);

export default router;
