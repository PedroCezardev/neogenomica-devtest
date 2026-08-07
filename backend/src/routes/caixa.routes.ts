import { Router } from 'express';
import { caixaController } from '../controllers/caixa.controller';

const router = Router();

// ⚠️ Rota específica ANTES de /:id
router.get('/:id/mapa', caixaController.getMapa);

router.get('/', caixaController.findAll);
router.get('/:id', caixaController.findById);
router.post('/', caixaController.create);
router.put('/:id', caixaController.update);
router.delete('/:id', caixaController.delete);

export default router;
