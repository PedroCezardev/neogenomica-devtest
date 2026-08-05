import { Router } from 'express';
import { salaController } from '../controllers/sala.controller';

const router = Router();

router.get('/', salaController.findAll);
router.get('/:id', salaController.findById);
router.post('/', salaController.create);
router.put('/:id', salaController.update);
router.delete('/:id', salaController.delete);

export default router;
