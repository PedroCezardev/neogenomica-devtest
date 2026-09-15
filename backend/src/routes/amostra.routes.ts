import { Router } from 'express';
import { amostraController } from '../controllers/amostra.controller';
import { sugestaoController } from '../controllers/sugestao.controller';
import { importacaoController } from '../controllers/importacao.controller';

const router = Router();

// Rotas específicas antes de /:id, evita conflito de parâmetros no Express
router.get('/sugerir-posicao', sugestaoController.sugerir);
router.post(
  '/importar',
  importacaoController.uploadMiddleware,
  importacaoController.importar
);

// CRUD básico, suporta filtros: ?codigoAmostra=&pacienteNome=&material=&exame=&caixaId=
router.get('/', amostraController.findAll);
router.get('/:id', amostraController.findById);
router.post('/', amostraController.create);
router.put('/:id', amostraController.update);
router.delete('/:id', amostraController.delete);

export default router;
