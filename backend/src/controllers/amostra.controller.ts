import { Request, Response, NextFunction } from 'express';
import { amostraService } from '../services/amostra.service';
import { createAmostraDto, updateAmostraDto } from '../dtos/amostra.dto';

export const amostraController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Suporta filtros via query string: ?codigoAmostra=A01&pacienteNome=João&material=DNA
      const { busca, codigoAmostra, pacienteNome, material, exame, caixaId } = req.query;

      const amostras = await amostraService.findAll({
        busca: busca as string | undefined,
        codigoAmostra: codigoAmostra as string | undefined,
        pacienteNome: pacienteNome as string | undefined,
        material: material as string | undefined,
        exame: exame as string | undefined,
        caixaId: caixaId ? Number(caixaId) : undefined,
      });

      res.json(amostras);
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const amostra = await amostraService.findById(Number(req.params.id));
      res.json(amostra);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createAmostraDto.parse(req.body);
      const amostra = await amostraService.create(data);
      res.status(201).json(amostra);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateAmostraDto.parse(req.body);
      const amostra = await amostraService.update(Number(req.params.id), data);
      res.json(amostra);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await amostraService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
