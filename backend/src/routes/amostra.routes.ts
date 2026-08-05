import { Router } from 'express';
import { amostraController } from '../controllers/amostra.controller';
import { sugestaoController } from '../controllers/sugestao.controller';

const router = Router();

// ⚠️ Rota específica DEVE vir antes de /:id — senão Express interpreta "sugerir-posicao" como um ID
router.get('/sugerir-posicao', sugestaoController.sugerir);

// CRUD básico (suporta filtros: ?codigoAmostra=&pacienteNome=&material=&exame=&caixaId=)
router.get('/', amostraController.findAll);
router.get('/:id', amostraController.findById);
router.post('/', amostraController.create);
router.put('/:id', amostraController.update);
router.delete('/:id', amostraController.delete);

export default router;

