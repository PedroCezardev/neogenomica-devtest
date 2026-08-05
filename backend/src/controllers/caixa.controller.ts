import { Request, Response, NextFunction } from 'express';
import { caixaService } from '../services/caixa.service';
import { mapaService } from '../services/mapa.service';
import { createCaixaDto, updateCaixaDto } from '../dtos/caixa.dto';

export const caixaController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const caixas = await caixaService.findAll();
      res.json(caixas);
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const caixa = await caixaService.findById(Number(req.params.id));
      res.json(caixa);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCaixaDto.parse(req.body);
      const caixa = await caixaService.create(data);
      res.status(201).json(caixa);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateCaixaDto.parse(req.body);
      const caixa = await caixaService.update(Number(req.params.id), data);
      res.json(caixa);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await caixaService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getMapa(req: Request, res: Response, next: NextFunction) {
    try {
      const mapa = await mapaService.gerarMapa(Number(req.params.id));
      res.json(mapa);
    } catch (err) {
      next(err);
    }
  },
};
