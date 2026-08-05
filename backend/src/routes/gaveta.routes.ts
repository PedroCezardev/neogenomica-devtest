import { Router } from 'express';
import { gavetaController } from '../controllers/gaveta.controller';

const router = Router();

router.get('/', gavetaController.findAll);
router.get('/:id', gavetaController.findById);
router.post('/', gavetaController.create);
router.put('/:id', gavetaController.update);
router.delete('/:id', gavetaController.delete);

export default router;
