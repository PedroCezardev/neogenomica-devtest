import { Request, Response, NextFunction } from 'express';
import { sugestaoService } from '../services/sugestao.service';

export const sugestaoController = {

  async sugerir(_req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await sugestaoService.sugerirPosicao();
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },
  
};
