import { Request, Response, NextFunction } from 'express';
import { gavetaService } from '../services/gaveta.service';
import { createGavetaDto, updateGavetaDto } from '../dtos/gaveta.dto';

export const gavetaController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const gavetas = await gavetaService.findAll();
      res.json(gavetas);
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const gaveta = await gavetaService.findById(Number(req.params.id));
      res.json(gaveta);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createGavetaDto.parse(req.body);
      const gaveta = await gavetaService.create(data);
      res.status(201).json(gaveta);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateGavetaDto.parse(req.body);
      const gaveta = await gavetaService.update(Number(req.params.id), data);
      res.json(gaveta);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await gavetaService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
