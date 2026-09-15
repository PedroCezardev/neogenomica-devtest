import { Router } from 'express';
import { freezerController } from '../controllers/freezer.controller';

const router = Router();

router.get('/', freezerController.findAll);
router.get('/:id', freezerController.findById);
router.post('/', freezerController.create);
router.put('/:id', freezerController.update);
router.delete('/:id', freezerController.delete);

export default router;
