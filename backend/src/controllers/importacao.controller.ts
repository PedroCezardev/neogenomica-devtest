import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { importacaoService } from '../services/importacao.service';
import { AppError } from '../middlewares/AppError';

// Multer em memória — o arquivo fica disponível como Buffer em req.file.buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.endsWith('.csv')) {
      cb(new AppError('Apenas arquivos .csv são aceitos', 400));
      return;
    }
    cb(null, true);
  },
});

export const importacaoController = {
  // Middleware do multer — disponibiliza o upload
  uploadMiddleware: upload.single('arquivo'),

  async importar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('Nenhum arquivo enviado. Use o campo "arquivo" com um .csv', 400);
      }

      const resultado = await importacaoService.importarCSV(req.file.buffer);

      res.status(200).json({
        mensagem: `Importação concluída: ${resultado.importadas} amostras importadas, ${resultado.ignoradas} ignoradas.`,
        ...resultado,
      });
    } catch (err) {
      next(err);
    }
  },
};
